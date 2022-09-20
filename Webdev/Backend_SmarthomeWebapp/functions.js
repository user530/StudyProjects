const e = require("express");
const md5 = require("md5");

/** Function to clean result from null properties
 * @param {Array.<object>} sqlQueryResult array of objects, result of the mysql query
 * @returns {Array.<object>} array of objects, cleared from keys with null values
 */
function cleanQuery(sqlQueryResult) {
  // Result variable
  const devices = new Array();

  // Iterate over result
  sqlQueryResult.forEach((row) => {
    // For each row create an object entry
    const item = new Object();
    // Check all keys
    for (const key in row) {
      // If the value is not null
      if (row[key] !== null) {
        // add it to item object
        item[key] = row[key];
      }
    }
    // Add filtered item row to the result variable
    devices.push(item);
  });

  return devices;
}

/** Function to create input form from the data object
 * @param {object} dataObj data object describing one device entity
 * @returns {string} html string
 */
function dataToForm(dataObj) {
  // Check for correct argument
  if (
    Object.getPrototypeOf(dataObj) === Object.prototype &&
    Object.keys(dataObj).length !== 0
  ) {
    // Create form
    let formHtml = `<form action="/deviceAdd" method="post" id="deviceAddForm">`;

    // Iterate over key's
    for (const key in dataObj) {
      if (key !== `id` && key !== `type`) {
        // make input depending on key/value
        formHtml += createInput(key, dataObj[key]);
      }
    }
    // Finish and return form
    formHtml += `<input type="submit" value="Add device"></form>`;
    return formHtml;
  }
}

/** Function to break property string into two parts
 * @param {string} propertyString property string containing name and input type
 * @returns {Array} Element1 String before brakets, element2 string inside brackets
 */
function splitPropertyStr(propertyString) {
  let part1, part2;
  // If separator exists in string
  if (propertyString.indexOf(`[`) !== -1) {
    part1 = propertyString.slice(0, propertyString.indexOf(`[`));
    part2 = propertyString.slice(
      propertyString.indexOf(`[`) + 1,
      propertyString.indexOf(`]`)
    );
  }
  // Else if there is no separator
  else {
    part1 = propertyString.trim();
    part2 = ``;
  }
  // Slice off input part
  return [part1, part2];
}

/** Function to get formated name string from the property string format
 * @param {string} propertyString property string containing name and input type
 * @returns {string} properly formated name string of device property
 */
function propertyGetName(propertyString) {
  // Slice off input part
  let propertyName = splitPropertyStr(propertyString)[0];
  // Split words and recconect them with white space
  propertyName = propertyName.split(`_`);
  propertyName = propertyName.join(` `);
  // Set first character to upper case
  propertyName =
    propertyName[0].toUpperCase() + propertyName.slice(1, propertyName.length);
  return propertyName;
}

/** Function to get values
 *  @param {string} value string value containing additional information about device
 *  @returns {Array.<string>} array of properties
 */
function parseValue(value) {
  const res = value.split(`,`);
  return res.map((str) => {
    return str.trim();
  });
}

/** Function to get current time
 *  @returns {string} current time in format HH:MM
 */
function getTime() {
  // Current time
  const nowTime = new Date().toLocaleTimeString(`en-GB`, {
    hour: `2-digit`,
    minute: `2-digit`,
  });
  return nowTime;
}

/** Function to get current date and time
 *  @param {number=0} addMin optional: offset from current date in minutes
 * @returns {string} date:time in form of YYYY:MM:DD HH:MM
 */
function getDateTime(addMin = 0) {
  // Current date
  let nowDate = new Date();
  const offset = nowDate.getTimezoneOffset();
  nowDate = new Date(nowDate.getTime() + addMin * 60000 - offset * 60 * 1000);

  // Format string
  return `${nowDate.toISOString().slice(0, 16)}`;
}

/** Function to clean adjust database time format
 * @param {string} timeStr time string in the format HH:MM:SS.MS
 * @returns timestamp string with trimed seconds and miliseconds
 */
function fixTime(timeStr) {
  // Index of the first separator(minutes)
  const min = timeStr.indexOf(`:`);
  // Index of the second separator(sec)
  const sec = timeStr.indexOf(`:`, min + 1);
  return timeStr.slice(0, sec);
}

/** Function to transform date object to input string format
 * @param {Date} dbDateObj date object storing date in ISOS format
 * @returns {string} local datetime in ISOS format - YYYY-MM-DDTHH:MM
 */
function fixDatetime(dbDateObj) {
  // Calculate offset
  const offset = new Date().getTimezoneOffset();
  // Adjust time to the local timezone
  dbDateObj = new Date(dbDateObj.getTime() - offset * 60 * 1000);
  // Transform to the string
  dbDateObj = dbDateObj.toISOString();
  // Trim after minutes and return
  return fixTime(dbDateObj);
}

/** Function to create input(-s) fields from data pair
 * @param {string} key property string, containing property name and required input type
 * @param {string} value property valid values, limits or ranges
 * @param {null} presetValue preset value for the input field, default - null
 * @param {boolean} locked onptional flag to lock input, default - false
 * @returns {string} input fields in html string form
 */
function createInput(key, value, presetValue = null, locked = false) {
  // Get data from key-value pair
  const name = propertyGetName(key);
  const formName = key.slice(0, key.indexOf(`[`));
  const input = splitPropertyStr(key)[1];
  const properties = parseValue(value);
  // Create input form wrapper and fill it with appropriate content
  let html = `<div id="${name}"><span>${name}: </span>`;

  // If lock flag passed, setup disable property for the input, else - empty
  const lock = locked ? ` disabled` : ``;

  switch (input) {
    case `radio`:
      // For each property stored
      properties.forEach((option, ind) => {
        // add radio buttons for all options (with labels)
        html += `<label><span>${option}</span>
            <input type="${input}" name="${formName}" value="${option}"`;
        // If presetValue is passed -> check button with same value
        if (presetValue && option === presetValue) {
          html += ` checked`;
        }
        // If no presetValue was passed -> check the last option
        if (!presetValue && ind === properties.length - 1) {
          html += ` checked`;
        }
        // Finish radio input
        html += `${lock}></label>`;
      });
      break;
    case `time`:
      // Create appropriate input, default - current time
      html += `<input type="${input}" name="${formName}"`;
      // If setValue passed -> set this value...
      if (presetValue) {
        html += `value="${fixTime(presetValue)}"`;
      }
      // else - set based on current time
      else {
        html += `value="${getTime()}"`;
      }
      // Finish time input
      html += `${lock}>`;
      break;
    case `range`:
      // Create range input, based on the properties
      html += `<input type="${input}" 
      name="${formName}"
      min="${properties[0]}" 
      max="${properties[1]}" 
      step="${properties[2]}" 
      oninput="this.nextSibling.innerText=this.value"`;

      // If correct preset value passed
      if (
        presetValue &&
        +presetValue <= +properties[1] &&
        +presetValue >= +properties[0]
      ) {
        html += ` value="${presetValue}"${lock}><span>${presetValue}</span>`;
      }
      // else -> dont set
      else {
        html += `${lock}><span>${Math.floor(
          (+properties[0] + +properties[1]) / 2
        )}</span>`;
      }
      break;
    case `color`:
      // Create color input
      html += `<input type="${input}" name="${formName}"`;
      // If presetValue is passed -> set it
      if (presetValue) {
        html += ` value="${presetValue}"`;
      }
      // else -> set default value
      else {
        html += ` value="${properties[0]}"`;
      }
      // Finish color input
      html += `${lock}>`;
      break;
    case `text`:
      // Create text input, based on the properties
      html += `<input type="${input}" name="${formName}" maxlength="${properties[1]}"`;
      // If preset value is passed -> set it
      if (presetValue) {
        html += ` value="${presetValue}"`;
      }
      // else -> set default value
      else {
        html += ` value="${properties[0]}"`;
      }
      // Finish color input
      html += `${lock}>`;
      break;
    case `datetime`:
      // Create date-time input, based on the properties
      html += `<input type="${input}-local" name="${formName}" min="${getDateTime()}"`;
      // If preset value passed
      if (presetValue) {
        html += ` value="${fixDatetime(presetValue)}"`;
      }
      // else ->default value
      else {
        html += ` value="${getDateTime(5)}"`;
      }
      // Finish color input
      html += `${lock}>`;
      break;
  }
  // Finish and return input form wrapper
  html += `</div>`;
  return html;
}

/** Function to create insert prepared sql statement template
 * @param {number} dataLength number of params to be inserted
 * @param {Array.<string>} keys array of row names (strings)
 * @returns {string} sql insert prepared statement template
 */
function insertTemplate(dataLength, keys) {
  // Check that request is not empty
  if (dataLength > 0) {
    // param string base
    let str = `?,`;
    // Make str of repeated number of params, delete last coma
    str = str.repeat(dataLength).slice(0, -1);
    // Insert query template
    let sqlInsert = `INSERT INTO devices(`;
    // Iterate over keys
    keys.forEach((key) => {
      // because our row names include special characters we need to add backticks
      sqlInsert += `\`${key}\`,`;
    });
    // finish insert statement string and return it
    sqlInsert = `${sqlInsert.slice(0, -1)}) VALUES (${str})`;
    return sqlInsert;
  }
}

/** Function to create insert prepared sql statement template
 * @param {number} dataLength number of params to be inserted
 * @param {Array.<string>} keys array of row names (strings)
 * @returns {string} sql update prepared statement template
 */
function updateTemplate(dataLength, keys) {
  // Check that request is not empty
  if (dataLength > 0) {
    // Prepare statement base
    let sqlUpdate = `UPDATE devices SET `;
    // Iterate over keys
    keys.forEach((key) => {
      // add keys to the statement
      sqlUpdate += `\`${key}\`=?,`;
    });
    // finish insert statement string and return it
    sqlUpdate = `${sqlUpdate.slice(0, -1)} WHERE \`id\`=?`;
    return sqlUpdate;
  }
}

/** Function to prepare message object for cookies
 * @param {string} msg message, that will be stored and used for check
 * @param {boolean} status message status: true - Success message, false - Error message
 * @returns {object.<string>} object of strings that store request code, sets up status and message info
 */
function prepareMessage(msg, status) {
  const result = {};
  switch (msg) {
    case `deviceAdd`:
      // Code req
      result.req = md5(md5(msg));
      if (status === true) {
        // Set status
        result.status = `Success`;
        // Set msg
        result.msg = `New device successfully added.`;
      } else if (status === false) {
        // Set status
        result.status = `Error`;
        // Set msg
        result.msg = `Failed to add new device, please check your data!`;
      }
      break;
    case `deviceUpdate`:
      // Code req
      result.req = md5(md5(msg));
      if (status === true) {
        // Set status
        result.status = `Success`;
        // Set msg
        result.msg = `Device settings successfully updated.`;
      } else if (status === false) {
        // Set status
        result.status = `Error`;
        // Set msg
        result.msg = `Failed to update settings, please check your data!`;
      }
      break;
    case `deviceDelete`:
      // Code req
      result.req = md5(md5(msg));
      if (status === true) {
        // Set status
        result.status = `Success`;
        // Set msg
        result.msg = `Device successfully deleted.`;
      } else if (status === false) {
        // Set status
        result.status = `Error`;
        // Set msg
        result.msg = `Failed to delete device, please check your data!`;
      }
      break;
    case `data`:
      // Code req
      result.req = md5(md5(msg));
      if (status === false) {
        // Set status
        result.status = `Error`;
        // Set msg
        result.msg = `Failed to load data, please check your request and try again!`;
      }
      break;
  }
  return result;
}

/** Function to handle redirect with service message
 * @param {string} type type of the error
 * @param {boolean} status operation status: success - true, problem - false
 * @param {object} queryResult result object of the HTTP query
 * @param {string} redirPageStr redirect route, default main page - '/'
 * @returns {void} prepares cookies and redirect with message param
 */
function handleRedirect(type, status, queryResult, redirPageStr = `/`) {
  try {
    // Prepare service message
    const bigCookie = prepareMessage(type, status);

    // Iterate over object and set cookies
    Object.keys(bigCookie).forEach((key) => {
      queryResult.cookie(key, bigCookie[key], {
        // Secure connection cookie, life time 10 sec
        maxAge: 1000 * 10,
        secure: true,
      });
    });

    // Redirect to the main page with service message
    queryResult.redirect(`${redirPageStr}?msg=${type}`);
  } catch {
    console.log(`Function 'Handle error' unexpected error`);
  }
}

/** Function to check for system message, confirm with cookies and add message data
 *  @param {object} requestObj HTTP request object
 *  @param {object} dataObj data object that holds data for rendering template
 *  @returns {void} on legit request - enque system message to the dataObj argument
 */
function checkForMessage(requestObj, dataObj) {
  if (requestObj.query[`msg`]) {
    // Get the query param
    const param = requestObj.query[`msg`];
    // Check for the cookies to confirm
    if (requestObj.cookies[`req`] === md5(md5(param))) {
      // if true - prepare MSG data: operation success status, msg text
      dataObj.sysMsg = [
        requestObj.cookies[`status`],
        requestObj.cookies[`msg`],
      ];
    }
  }
}

/** Function to sanitize and push data sent by the user in the post request
 * @param {Array<string>} keyArr array of key values from the request body
 * @param {Array<string, number>} sanitizedArr array that will hold sanitized user data
 * @param {Object} reqObj http request object
 * @returns {Array<string, number>} array of sanitized request values
 */
function sanitizePush(keyArr, sanitizedArr, reqObj) {
  // Iterate over all keys
  keyArr.forEach((key) => {
    // Sanitize data passed and add to the param array
    sanitizedArr.push(reqObj.sanitize(reqObj.body[key]));
  });
  return sanitizedArr;
}
module.exports = {
  cleanQuery: cleanQuery,
  dataToForm: dataToForm,
  splitPropertyStr: splitPropertyStr,
  propertyGetName: propertyGetName,
  parseValue: parseValue,
  createInput: createInput,
  insertTemplate: insertTemplate,
  updateTemplate: updateTemplate,
  prepareMessage: prepareMessage,
  handleRedirect: handleRedirect,
  checkForMessage: checkForMessage,
  sanitizePush: sanitizePush,
};

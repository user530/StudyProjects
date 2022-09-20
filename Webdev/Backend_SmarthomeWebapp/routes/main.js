const { query } = require("express");
const md5 = require("md5");
const functions = require(`../functions`);

module.exports = (app) => {
  // Main page route - if non existing link is given, reroute to main
  app.get(`/`, (req, res) => {
    // Setup response data object
    const data = {};
    // If page is queried with service message
    functions.checkForMessage(req, data);
    // Render page with passed data (system message)
    res.render(`index.html`, data);
  });

  app.get(`/about`, (req, res) => {
    res.render(`about.html`);
  });

  app.get(`/list`, (req, res) => {
    // Query string to select all information from devices table
    const queryStr = `SELECT * FROM devices`;
    // Execute query
    db.query(queryStr, (err, dbResult) => {
      // Handle possible error
      if (err) {
        // Log error
        console.error(`Database querry error - ${queryStr}!`, err.message);

        // Redirect with service message
        functions.handleRedirect(`data`, false, res);
      } else {
        // Setup response data object, add list of all available devices
        const data = { devices: functions.cleanQuery(dbResult) };

        // If page is queried with service message
        functions.checkForMessage(req, data);

        // Render page if there is no error
        res.render(`list.html`, data);
      }
    });
  });

  app.get(`/deviceAdd`, (req, res) => {
    // On initial load -> Route 1
    if (!req.query.show) {
      // DB query to get all known smart device types
      const reqTypes = `SELECT type FROM properties`;
      // Execute query
      db.query(reqTypes, (err, resTypes) => {
        // Handle error
        if (err) {
          // Log error
          console.error(`Database querry error - ${reqTypes}!`, err.message);
          // Redirect with message
          functions.handleRedirect(`data`, false, res);
        }

        // Get all applicable properties of the 1st device
        const reqInitProper = `SELECT * FROM properties LIMIT 1`;

        // Query information about first device type
        db.query(reqInitProper, (err2, resProper) => {
          // Handle error
          if (err2) {
            // Log error
            console.error(
              `Database querry error - ${reqInitProper}!`,
              err2.message
            );
            // Redirect with message
            functions.handleRedirect(`data`, false, res);
          } else {
            // Render page with form and data
            res.render(`deviceAdd.html`, {
              types: resTypes,
              form: functions.dataToForm(functions.cleanQuery(resProper)[0]),
            });
          }
        });
      });
    }
    // When user selects input -> Route2
    else {
      // Request to get new properties list
      const reqNewProper = `SELECT * FROM properties WHERE type=?`;
      // Sanitized input - type of the device to get properties
      const sanitInp = req.sanitize(req.query.show);

      // Request for additional properties data, based on selected type
      db.query(reqNewProper, sanitInp, (err, resNewProper) => {
        // handle errors
        if (err) {
          // Log error
          console.error(
            `Database querry error - ${reqNewProper}!`,
            err.message
          );
          // Redirect with message
          functions.handleRedirect(`data`, false, res);
        } else {
          // if no errors, send new data back
          const info = functions.cleanQuery(resNewProper);
          res.send(functions.dataToForm(info[0]));
        }
      });
    }
  });

  app.post(`/deviceAdd`, (req, res) => {
    // Keys from data object passed through post request
    const bodyKeys = Object.keys(req.body);
    // Prepare statement template
    const template = functions.insertTemplate(bodyKeys.length, bodyKeys);
    // Prepare params
    const sqlParams = [];

    // Fill params array with sanitized data
    functions.sanitizePush(bodyKeys, sqlParams, req);

    // Query to new device data
    db.query(template, sqlParams, (sqlErr, insertRes) => {
      // Handle errors
      if (sqlErr) {
        // Log error
        console.error(`Database querry error - ${template}!`, sqlErr.message);
        // Redirect with message
        functions.handleRedirect(`deviceAdd`, false, res);
      } else {
        // Redirect to the device list with message
        functions.handleRedirect(`deviceAdd`, true, res, `/list`);
      }
    });
  });

  app.get(`/deviceStatus`, (req, res) => {
    // if request w/o params
    if (Object.keys(req.query).length === 0) {
      // Redirect to the device list
      res.redirect(`/list`);
    }
    // if request with correct param
    else if (req.query.device) {
      // Store requested item ip
      const id = req.sanitize(req.query.device);
      // Prepare query
      const query = `SELECT * FROM devices WHERE id=?`;
      // Query the DB to try and find information about queried device
      db.query(query, [id], (err, itemRes) => {
        // Handle error
        if (err) {
          // Log error
          console.error(err);
          // Redirect with message
          functions.handleRedirect(`data`, false, res);
        }
        // No error
        else {
          // If device found
          if (itemRes.length > 0) {
            // Collect data about device
            const data = functions.cleanQuery(itemRes)[0];

            // Prepare statement to query information about required device type
            const typeQuery = `SELECT * FROM properties WHERE type=?`;
            // Prepare query param
            const typeParam = req.sanitize(data[`type`]);

            // Store information about required device type and properties limits
            db.query(typeQuery, [typeParam], (typeErr, typeRes) => {
              // Handle error
              if (typeErr) {
                // Log error
                console.error(typeErr);
                // Redirect with message
                functions.handleRedirect(`data`, false, res);
              }
              // If no errors
              else {
                // Prepare html string
                let html = `<div id="${data[`name`]}" class="deviceCard">
                <div id="Type">Device type: ${data[`type`]}</div>`;
                // Object containing required type properties
                const typeObj = functions.cleanQuery(typeRes)[0];
                // Iterate over device properties
                Object.keys(typeObj).forEach((key) => {
                  if (key !== `type`) {
                    // Column name w/o input type, to get value from the data table
                    const colName = functions.splitPropertyStr(key)[0];

                    // Create information field for device type and load values from DB
                    html += functions.createInput(
                      key,
                      typeObj[key],
                      data[colName],
                      true
                    );
                  }
                });

                // Finish html string
                html += `</div>`;
                // Render page with information about the device
                res.render(`deviceStatus.html`, {
                  dbData: data,
                  deviceHtml: html,
                });
              }
            });
          }
          // If there is no such device
          else {
            functions.handleRedirect(`data`, false, res);
          }
        }
      });
    }
    // if request with incorrect param
    else {
      res.redirect(`/404`);
    }
  });

  app.get(`/deviceUpdate`, (req, res) => {
    // if request w/o params
    if (Object.keys(req.query).length === 0) {
      // Redirect to the device list
      res.redirect(`/list`);
    }
    // if request with correct param
    else if (req.query.device) {
      // Store requested item ip
      const id = req.sanitize(req.query.device);
      // Prepare query
      const query = `SELECT * FROM devices WHERE id=?`;
      // Query the DB to try and find information about queried device
      db.query(query, [id], (err, itemRes) => {
        // Handle error
        if (err) {
          // Log error
          console.error(err);
          // Redirect with message
          functions.handleRedirect(`data`, false, res);
        }
        // No error
        else {
          // If device found
          if (itemRes.length > 0) {
            // Collect data about device
            const data = functions.cleanQuery(itemRes)[0];

            // Prepare statement to query information about required device type
            const typeQuery = `SELECT * FROM properties WHERE type=?`;
            // Prepare query param
            const typeParam = req.sanitize(data[`type`]);

            // Store information about required device type and properties limits
            db.query(typeQuery, [typeParam], (typeErr, typeRes) => {
              // Handle error
              if (typeErr) {
                // Log error
                console.error(typeErr);
                // Redirect with message
                functions.handleRedirect(`data`, false, res);
              }
              // If no errors
              else {
                // Prepare html string
                let html = `<div id="${data[`name`]}" class="deviceCard">
                <div id="Type">Device type: ${data[`type`]}</div>`;

                // Add form wrapper
                html += `<form action="/deviceUpdate?device=${id}" method="post" id="deviceUpdateForm">`;

                // Object containing required type properties
                const typeObj = functions.cleanQuery(typeRes)[0];
                // Iterate over device properties
                Object.keys(typeObj).forEach((key) => {
                  if (key !== `type`) {
                    // Column name w/o input type, to get value from the data table
                    const colName = functions.splitPropertyStr(key)[0];

                    // Create information field for device type and load values from DB
                    html += functions.createInput(
                      key,
                      typeObj[key],
                      data[colName]
                    );
                  }
                });

                // Close form
                html += `</form>`;
                // Add button to update settings
                html += `<input type="submit" form="deviceUpdateForm" value="Update settings">`;

                // Finish html string
                html += `</div>`;
                // Render page with information about the device
                res.render(`deviceUpdate.html`, {
                  dbData: data,
                  deviceHtml: html,
                });
              }
            });
          }
          // If there is no such device
          else {
            functions.handleRedirect(`data`, false, res);
          }
        }
      });
    }
    // if request with incorrect param
    else {
      res.redirect(`/list`);
    }
  });

  app.post(`/deviceUpdate`, (req, res) => {
    // if request w/o params
    if (Object.keys(req.query).length === 0) {
      // Redirect to the device list
      res.redirect(`/list`);
    }
    // Check for correct param
    else if (req.query.device) {
      // Store requested item ip
      const id = req.sanitize(req.query.device);
      // Prepare query
      const query = `SELECT * FROM devices WHERE id=?`;
      // Query the DB to try and find information about queried device
      db.query(query, [id], (err, itemRes) => {
        // Handle error
        if (err) {
          // Log error
          console.error(err);
          // Redirect with message
          functions.handleRedirect(`data`, false, res);
        }
        // No error
        else {
          // If device found
          if (itemRes.length > 0) {
            // Keys from data object passed through post request
            const bodyKeys = Object.keys(req.body);
            // Prepare statement template
            const template = functions.updateTemplate(
              bodyKeys.length,
              bodyKeys
            );
            // Prepare params
            const sqlParams = [];

            // Fill params array with sanitized data
            functions.sanitizePush(bodyKeys, sqlParams, req);

            // Finish with id param
            sqlParams.push(req.sanitize(req.query.device));

            // Query devise settings update
            db.query(template, sqlParams, (sqlErr, updateRes) => {
              // Handle errors
              if (sqlErr) {
                // Log error
                console.error(
                  `Database querry error - ${template}!`,
                  sqlErr.message
                );
                // Redirect with message
                functions.handleRedirect(`deviceUpdate`, false, res);
              } else {
                // Redirect to the device list with message
                functions.handleRedirect(`deviceUpdate`, true, res, `/list`);
              }
            });
          }
          // If there is no such device
          else {
            functions.handleRedirect(`data`, false, res);
          }
        }
      });
    }
    // If no device ID passed
    else {
      res.redirect(`/list`);
    }
  });

  app.get(`/deviceDelete`, (req, res) => {
    // if request w/o params
    if (Object.keys(req.query).length === 0) {
      // Redirect to the device list
      res.redirect(`/list`);
    }
    // if request with correct param
    else if (req.query.device) {
      // Store requested item ip
      const id = req.sanitize(req.query.device);
      // Prepare query
      const query = `DELETE FROM devices WHERE id=?`;
      // Query to delete device data from the database
      db.query(query, [id], (err, delRes) => {
        // Handle errors
        if (err) {
          // Log error
          console.error(`Database querry error - ${template}!`, err.message);
          // Redirect with message
          functions.handleRedirect(`deviceDelete`, false, res);
        } else {
          // Redirect to the device list with message
          functions.handleRedirect(`deviceDelete`, true, res, `/list`);
        }
      });
    }
    // if request with incorrect param
    else {
      res.redirect(`/list`);
    }
  });

  // Handle 404 requests -> Show
  app.use((req, res) => {
    res.status(404).render(`404.html`);
  });

  // Handle error
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send(`Unexpected error`);
  });
};

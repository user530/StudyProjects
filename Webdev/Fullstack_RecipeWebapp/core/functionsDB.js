// MD5 hash generator
const md5 = require("md5");

async function executeQuery(query, params) {
  // Error handling
  try {
    // Create promise for async functionality
    const promise = new Promise((promRes, promRej) => {
      // Query the database
      db.query(query, params, (err, res) => {
        if (err) {
          promRej(err);
        }
        // Save the DB result
        promRes(res);
      });
    });

    // Return the result
    return await promise;
  } catch (err) {
    // Log the error and return it
    console.error(err);
    return err;
  }
}

async function select(tableName, filterColName, filterColValue) {
  // Prepare statement
  const selectQ = `SELECT * FROM ?? WHERE ?? = ?`;

  // Execute statement
  const q = await executeQuery(selectQ, [...arguments]);

  // Return the data if all is fine
  if (!(q instanceof Error) && q.length > 0) return q[0];
  else return null;
}

async function addUser(userName, userPassword) {
  const insertQ = `INSERT INTO \`users\` (\`user_login\`, \`user_password\`, \`user_role_id\`) VALUES (?, ?, ?)`;
  const params = [userName, userPassword, 2];

  const q = await executeQuery(insertQ, params);

  // Return querry result if succesfully executed or Null if error
  if (!(q instanceof Error)) return q;
  else return null;
}

async function createUser(reqBody) {
  const errors = [];

  // Check the keys
  checkUserKeys(reqBody, errors);

  // Validate the input
  validateAccInput(reqBody, errors);

  // Check that user name exists
  await userVacant(reqBody, errors);

  // If there are some errors in the process
  if (errors.length > 0) {
    const res = { status: false, msg: `` };
    for (const err of errors) res.msg += err + `\n`;
    return res;
  }
  // If all is fine
  else {
    // Try to create the user account
    if (await addUser(reqBody.user_name, md5(md5(reqBody.user_password))))
      return { status: true, msg: `Account successfully created!` };
    // If there is an error
    else
      return { status: false, msg: `Database insertion error! [createUser]` };
  }
}

async function login(reqBody, ip) {
  const errors = [];

  // Check the keys
  checkUserKeys(reqBody, errors);

  // Validate the input
  validateAccInput(reqBody, errors);

  // Check that user name exists
  await userExists(reqBody, errors);

  // Check user credentials
  const id = await checkUser(reqBody, errors);

  // If there are some errors
  if (errors.length > 0) {
    // Prepare result, fill message with errors and return
    const res = { status: false, msg: `` };
    for (const err of errors) {
      res.msg += err + `\n`;
    }
    return res;
  } else {
    // If everything is fine - generate new hash and get ip
    const hash = generateHash();

    // If IP bint deactivated - we set IP to null
    if (!reqBody.user_bind_ip) ip = 0;

    // Update the login data
    if (await updateUser(id, hash, ip)) {
      // Return successfull message
      return { status: true, msg: `Login successful!`, id: id, hash: hash };
    }
    // If there is an error
    else return { status: false, msg: `Login error! [login]` };
  }
}

// Helper function to check the user data keys
function checkUserKeys(reqBody, errorsArr) {
  const keys = Object.keys(reqBody);

  if (!keys.includes(`user_name`) || !keys.includes(`user_password`)) {
    errorsArr.push(`Error! User name OR password are missing!`);
  }
}

// Helper function to validate the name and password
function validateAccInput(reqBody, errorsArr) {
  // Prepare the regex for validation
  const uName = /^[A-Za-z0-9]{4,30}$/g;
  const uPass = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,32}$/g;

  // Validate the user name
  if (!uName.test(reqBody.user_name)) {
    errorsArr.push(
      `Error! User name is not matching the pattern: 4-30 alphanumeric characters.`
    );
  }

  // Validate the user password
  if (!uPass.test(reqBody.user_password)) {
    errorsArr.push(
      `Error! User password is not matching the pattern: 6-32 alphanumeric characters (plus some special characters).`
    );
  }
}

// Helper function to confirm that username is vacant
async function userVacant(reqBody, errorsArr) {
  const res = await select(`users`, `user_login`, reqBody.user_name);

  if (res) {
    errorsArr.push(
      `Error! User name is already taken, please try another one!`
    );
  }
}

// Helper function to confirm that username exists
async function userExists(reqBody, errorsArr) {
  const res = await select(`users`, `user_login`, reqBody.user_name);

  if (!res) {
    errorsArr.push(`Error! User name doesn't exist, please try another one!`);
  }
}

async function checkUser(reqBody, errorsArr) {
  const query = `SELECT \`user_id\` FROM \`users\` WHERE \`user_login\`=? AND \`user_password\`=?`;
  const params = [reqBody.user_name, md5(md5(reqBody.user_password))];

  const q = await executeQuery(query, params);

  // Return the login if all is fine
  if (
    !(q instanceof Error) &&
    q.length > 0 &&
    Object.keys(q[0]).includes(`user_id`)
  )
    return q[0].user_id;
  else {
    errorsArr.push(`Error! Password doesn't match, please try again!`);
    return null;
  }
}

function generateHash(hashSize = 10) {
  const chars = `qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789`;
  let hash = ``;
  while (hash.length < hashSize) {
    const randInd = Math.floor(Math.random() * chars.length);
    hash += chars[randInd];
  }

  return md5(hash);
}

async function updateUser(userId, hash, ip) {
  let query, params;
  // Prepare query and params
  query = `UPDATE \`users\` SET \`user_hash\`=?, \`user_ip\`=INET_ATON(?) WHERE \`user_id\`=?`;
  params = [hash, ip, userId];

  // Execute the query
  const q = await executeQuery(query, params);

  // Return the login if all is fine
  if (!(q instanceof Error) && q.affectedRows > 0) {
    return q.affectedRows;
  } else return null;
}

async function getUser(cookies, id, ip) {
  // Check that user have correct authorization cookies and accessing correct page
  if (cookies.id && cookies.hash && cookies.id == id) {
    // Try to get user information
    const query = `SELECT u.\`user_id\`,
                          u.\`user_login\`,
                          u.\`user_hash\`,
                          INET_NTOA(u.\`user_ip\`) AS \`user_ip\`,
                          r.\`role_name\`
                  FROM \`users\` AS u
                  INNER JOIN \`user_roles\` AS r
                  ON u.\`user_role_id\`=r.\`role_id\`
                  WHERE u.\`user_id\`=?`;
    let user = (await executeQuery(query, [parseInt(cookies.id, 10)]))[0];

    // If auth cookies exist
    if (user) {
      // If userID is not confirmed
      if (user.user_id != cookies.id) return null;

      // If hash is not confirmed
      if (user.user_hash != cookies.hash) return null;

      // If ip bind activated, but ip is not confirmed
      if (user.user_ip != `0.0.0.0` && user.user_ip != ip) return null;

      // All is fine
      return { id: user.user_id, login: user.user_login, role: user.role_name };
    }
  }
  // If user is not authenticated
  else return null;
}

async function getSteps(recipeId) {
  // Prepare query and execute it
  const query = `SELECT \`step_no\`, \`step_description\` FROM \`recipe_steps\` WHERE \`recipe_id\`=? ORDER BY \`step_no\``;
  const q = await executeQuery(query, [recipeId]);

  // Return result or null if error
  if (q.length > 0) return q;
  else return null;
}

async function getDiets(recipeId) {
  // Prepare query and execute it
  const query = `SELECT d.\`diet_name\` 
                  FROM \`recipe_diet\` AS rd
                  INNER JOIN \`diets\` AS d ON rd.\`diet_id\`=d.\`diet_id\`
                  WHERE rd.\`recipe_id\`=?`;
  const q = await executeQuery(query, [recipeId]);

  // Return result or null if error
  if (q.length > 0) return q;
  else return null;
}

async function getIngredients(recipeId) {
  // Prepare query and execute it
  const query = `SELECT i.\`ingredient_name\`, ri.\`ingredient_amount\`, u.\`unit_name\`
                FROM \`recipe_ingredient\` AS ri
                INNER JOIN \`ingredient\` AS i ON ri.\`ingredient_id\`=i.\`ingredient_id\`
                INNER JOIN \`units\` AS u ON ri.\`unit_id\`=u.\`unit_id\`
                WHERE ri.\`recipe_id\`=?`;
  const q = await executeQuery(query, [recipeId]);

  // Return result or null if error
  if (q.length > 0) return q;
  else return null;
}

async function getUnitsForIngr(ingrId) {
  // Prepare query to retrieve units
  const query = `SELECT iu.\`unit_id\`, u.\`unit_name\` 
  FROM \`ingredient_unit\` AS iu 
  INNER JOIN \`units\` AS u ON iu.\`unit_id\` = u.\`unit_id\`
  WHERE iu.\`ingredient_id\`=?`;

  // Execute query and get the result
  const q = await executeQuery(query, [ingrId]);

  // Return units
  return q;
}

async function selectIngrUnit(ingrDataArr) {
  // Prepare query base
  const queryBase = `SELECT *
  FROM \`ingredient\` AS i 
  INNER JOIN \`ingredient_unit\` AS iu ON i.\`ingredient_id\`=iu.\`ingredient_id\`
  WHERE i.\`ingredient_id\`=? AND iu.\`unit_id\`=? UNION `;

  // Prepare query itself
  let query = ``;
  let params = [];

  // Fill the query based on the number of ingredients
  for (let i = 0; i < ingrDataArr.length; ++i) {
    query += `${queryBase}`;
    params.push(ingrDataArr[i].ingredientId, ingrDataArr[i].unitId);
  }

  // Trim the last 'UNION ' from query
  query = query.substring(0, query.length - 6);

  // Get the nutrition information
  const q = await executeQuery(query, params);

  if (!(q instanceof Error)) return q;
  else return null;
}

async function calculateNutrition(ingrDataArr) {
  // Get ingredient unit data
  const q = await selectIngrUnit(ingrDataArr);

  // Prepare factor variables
  let calories = 0;
  let carbs = 0;
  let fats = 0;
  let proteins = 0;
  let ttlAmnt = 0;

  // If query was successfull
  if (q) {
    // Iterate over nutrition data and calculate total factor values
    q.forEach((row, ind) => {
      // From units to gram/100
      const cGrams = (ingrDataArr[ind].amount * row.grams_per_unit) / 100;

      // Calculate total amount
      ttlAmnt += cGrams;

      // Calculate total nutrition factors
      calories += cGrams * row.ingredient_cal_100g;
      carbs += cGrams * row.ingredient_carbs_100g;
      fats += cGrams * row.ingredient_fats_100g;
      proteins += cGrams * row.ingredient_prots_100g;
    });

    // Calculate to the nutrition per 100 g
    calories = Math.round((calories / ttlAmnt) * 100) / 100;
    carbs = Math.round((carbs / ttlAmnt) * 100) / 100;
    fats = Math.round((fats / ttlAmnt) * 100) / 100;
    proteins = Math.round((proteins / ttlAmnt) * 100) / 100;

    // Send the nutrition data, (fixed, bcs sometimes round fails...) or null
    return {
      calories: calories.toFixed(2),
      carbs: carbs.toFixed(2),
      fats: fats.toFixed(2),
      proteins: proteins.toFixed(2),
    };
  }
  return null;
}

async function multiInsert(tableName, columnsArr, paramsArr) {
  // Prepare columns string according to the DB format (`)
  const columns = columnsArr.map((v) => "`" + v + "`").join(`,`);
  // Prepare the single param row template based on the columns number
  const paramTemplate = Array(columnsArr.length).fill(`?`).join(`,`);
  // Based on the number of param rows prepare the values for the multi insert query
  const slots = Array(paramsArr.length).fill(`(${paramTemplate})`).join(`,`);

  // Insert query
  const query = `INSERT INTO \`${tableName}\`(${columns}) VALUES ${slots}`;
  // Flatten params
  const params = paramsArr.flat();

  // Execute the query
  const q = await executeQuery(query, params);

  // Return based on the query result
  if (!(q instanceof Error)) return q;
  else return null;
}

async function filterRecipeTable(filterObj) {
  // Recipe table query base - filter by name
  let queryBase = `SELECT r1.\`recipe_id\` FROM (SELECT * FROM \`recipe\` WHERE \`recipe_name\` LIKE ?) AS r1`;
  let queryParams = [`%${filterObj.name}%`];

  // If preptime filter on - add filter query
  if (filterObj.filterPreptime) {
    queryBase += ` INNER JOIN (SELECT * FROM \`recipe\` WHERE \`recipe_preptime\` BETWEEN ? AND ?) AS r2 ON r1.\`recipe_id\`=r2.\`recipe_id\``;
    queryParams.push(filterObj.preptimeMin, filterObj.preptimeMax);
  }

  // If calories filter on - add filter query
  if (filterObj.filterCal) {
    queryBase += ` INNER JOIN (SELECT * FROM \`recipe\` WHERE \`recipe_calorie\` BETWEEN ? AND ?) AS r3 ON r1.\`recipe_id\`=r3.\`recipe_id\``;
    queryParams.push(filterObj.calMin, filterObj.calMax);
  }

  // If carbs filter on - add filter query
  if (filterObj.filterCarbs) {
    queryBase += ` INNER JOIN (SELECT * FROM \`recipe\` WHERE \`recipe_carbs\` BETWEEN ? AND ?) AS r4 ON r1.\`recipe_id\`=r4.\`recipe_id\``;
    queryParams.push(filterObj.carbsMin, filterObj.carbsMax);
  }

  // If fat filter on - add filter query
  if (filterObj.filterFat) {
    queryBase += ` INNER JOIN (SELECT * FROM \`recipe\` WHERE \`recipe_fats\` BETWEEN ? AND ?) AS r5 ON r1.\`recipe_id\`=r5.\`recipe_id\``;
    queryParams.push(filterObj.fatMin, filterObj.fatMax);
  }

  // If protein filter on - add filter query
  if (filterObj.filterProt) {
    queryBase += ` INNER JOIN (SELECT * FROM \`recipe\` WHERE \`recipe_prots\` BETWEEN ? AND ?) AS r6 ON r1.\`recipe_id\`=r6.\`recipe_id\``;
    queryParams.push(filterObj.protMin, filterObj.protMax);
  }

  // Query data
  const q = await executeQuery(queryBase, queryParams);

  // Return querry result if succesfully executed or Null if error
  if (!(q instanceof Error)) return q;
  else return null;
}

// Function to get the filtered array of recipe IDs that satisfy condition (diets/ingredients)
async function filterTagTable(
  filterObj,
  tableName,
  condColName,
  inclFlag,
  inclValArr,
  exclFlag,
  exclValArr
) {
  // Prepare 'default' inclusion (ALL IDs)
  let incl = await executeQuery(
    `SELECT DISTINCT \`recipe_id\` FROM \`${tableName}\``
  );
  // If query is successfull -> transform to array of IDs
  if (incl) incl = incl.map((val) => val.recipe_id);

  // Prepare 'default' exclusion (Empty)
  let excl = [];

  // If inclusion flag is set
  if (filterObj[inclFlag]) {
    // Get the ID's of all recipe's that must be included
    incl = await multiCondTableFilter(
      tableName,
      condColName,
      filterObj[inclValArr]
    );

    // If query is successfull -> transform to array of IDs
    if (incl) incl = incl.map((val) => val.recipe_id);
  }

  // If exclusion flag is set
  if (filterObj[exclFlag]) {
    // Get the ID's of all recipe's that must be excluded
    excl = await multiCondTableFilter(
      tableName,
      condColName,
      filterObj[exclValArr]
    );

    // If query is successfull -> transform to array of IDs
    if (excl) excl = excl.map((val) => val.recipe_id);
  }

  // If all database queries were correct -> return the array of values that satisfy both conditions
  if (incl && excl) {
    return incl.filter((val) => !excl.includes(val));
  }

  // If some query failed -> return null
  return null;
}

// Function to get the data filtered out by number of condition (in some recipe junction table)
async function multiCondTableFilter(tableName, condColName, condValArr) {
  // No Values for condition
  if (condValArr.length == 0) return [];

  // If at least one values is passed - prepare base
  let queryBase = `SELECT t1.\`recipe_id\` FROM (SELECT * FROM ${tableName} WHERE ${condColName}=?) AS t1`;

  // Join query strings for other conditions
  for (let i = 1; i < condValArr.length; ++i)
    queryBase += ` INNER JOIN (SELECT * FROM ${tableName} WHERE ${condColName}=?) AS t${
      i + 1
    } ON t1.\`recipe_id\`=t${i + 1}.\`recipe_id\``;

  // Execute query
  const q = await executeQuery(queryBase, condValArr);

  // Return querry result if succesfully executed or Null if error
  if (!(q instanceof Error)) return q;
  else return null;
}

module.exports = {
  executeQuery,
  select,
  createUser,
  login,
  getUser,
  getSteps,
  getIngredients,
  getDiets,
  getUnitsForIngr,
  calculateNutrition,
  selectIngrUnit,
  multiInsert,
  filterRecipeTable,
  filterTagTable,
};

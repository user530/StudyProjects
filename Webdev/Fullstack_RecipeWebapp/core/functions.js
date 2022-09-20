// Mysql
const mysql = require(`mysql`);

// DB connection function
function dbConnection(_dbConfig, reconnect = false) {
  // Create connection
  const connection = mysql.createConnection(_dbConfig);
  // Connect to DB
  connection.connect((err) => {
    // Check for problems with connection
    if (err) {
      // Log the error
      console.error(
        `Database connection problem! [dbConnection].`,
        err.message
      );
      // Signal and reconnect
      console.log(`Attempting to reconnect...`);
      setTimeout(dbConnection(_dbConfig, true), 2000);
    }
  });

  // Handle errors
  connection.on(`error`, (err) => {
    // Log the error
    console.error(`Connection problem! [dbConnection].`, err.message);
    // On lost connection
    if (
      err.code == `PROTOCOL_CONNECTION_LOST` ||
      err.code == `PROTOCOL_PACKETS_OUT_OF_ORDER`
    ) {
      // Signal and reconnect
      console.log(`Attempting to reconnect...`);
      dbConnection(_dbConfig, true);
    }
    // other error
    else {
      // Throw it
      throw err;
    }
  });

  // Log the recconection
  if (reconnect) console.log(`Connection restored`);

  // Make database available outside
  global.db = connection;
}

function getIp(request) {
  // Get request ip
  let ip =
    request.headers["x-forwarded-for"] || request.connection?.remoteAddress;
  // Check for IPv6 prefix and adjust ip adress
  if (ip.substr(0, 7) == `::ffff:`) {
    ip = ip.substr(7);
  }

  return ip;
}

function processRecipeForm(formObj) {
  // Prepare result object
  const result = {};
  // Try to gather form data
  try {
    // Parse name
    result.name = String(formObj.recipe_name).trim();
    // Parse preptime
    result.preptime = parseInt(formObj.recipe_preptime);
    // Parse diets
    result.diets = parseFormField(formObj.dietTag, parseInt).filter(
      (v) => v > 0
    );
    // Parse ingredients
    result.ingredients = parseFormField(formObj.ingredient, parseInt).filter(
      (v) => v > 0
    );
    // Parse units
    result.units = parseFormField(formObj.unit, parseInt).filter((v) => v > 0);
    // Parse amount
    result.amounts = parseFormField(formObj.ingredient_amount, parseInt).filter(
      (v) => v > 0
    );
    // Parse description
    result.desription = String(formObj.recipe_descr).trim();
    // Parse steps
    result.steps = parseFormField(formObj.recipe_step, String).filter(
      (v) => v.trim() != ``
    );

    return result;
  } catch {
    return null;
  }
}

function parseFormField(formField, cb) {
  if (!(formField instanceof Array))
    return cb(formField) ? [cb(formField)] : [0];
  return formField
    .map((val) => cb(val))
    .filter((val) => typeof val != `number` || !isNaN(val));
}

// Helper function to validate recipe form fields
function validateRecipeForm(
  name,
  preptime,
  diets,
  ingredients,
  units,
  amounts,
  description,
  steps
) {
  return (
    name.length > 0 &&
    preptime > 0 &&
    ingredients.length > 0 &&
    units.length > 0 &&
    amounts.length > 0 &&
    ingredients.length == units.length &&
    ingredients.length == amounts.length &&
    description.length > 0 &&
    steps.length > 0
  );
}

function processSearchForm(formObj) {
  // Prepare result object
  const result = {};
  // Try to gather form data
  try {
    // Parse name
    result.name = String(formObj.filter_name).trim();

    // If preptime filter is toggled
    if (formObj.filter_preptime) {
      // Turn filter flag on
      result.filterPreptime = true;

      // Set 0 if empty or value if passed
      parseInt(formObj.filter_preptime_min)
        ? (result.preptimeMin = parseInt(formObj.filter_preptime_min))
        : (result.preptimeMin = 0);

      // Set 9999 (max possible in DB field) if empty or value if passed
      parseInt(formObj.filter_preptime_max)
        ? (result.preptimeMax = parseInt(formObj.filter_preptime_max))
        : (result.preptimeMax = 9999);
    }

    // If diets include filter is toggled
    if (formObj.filter_diets_incl) {
      // Turn filter flag on
      result.filterDietIncl = true;

      // Add diet IDs to include
      result.dietsIncl = parseFormField(formObj.diets_incl, parseInt);
    }

    // If diets exclude filter is toggled
    if (formObj.filter_diets_excl) {
      // Turn filter flag on
      result.filterDietExcl = true;

      // Add diet IDs to exclude
      result.dietsExcl = parseFormField(formObj.diets_excl, parseInt);
    }

    // If ingredient include filter is toggled
    if (formObj.filter_ingredients_incl) {
      // Turn filter flag on
      result.filterIngrIncl = true;

      // Add ingredient IDs to include
      result.ingredIncl = parseFormField(formObj.ingredients_incl, parseInt);
    }

    // If ingredient exclude filter is toggled
    if (formObj.filter_ingredients_excl) {
      // Turn filter flag on
      result.filterIngrExcl = true;

      // Add ingredient IDs to exclude
      result.ingredExcl = parseFormField(formObj.ingredients_excl, parseInt);
    }

    // If calories filter is toggled
    if (formObj.filter_cal) {
      // Turn filter flag on
      result.filterCal = true;

      // Set 0 if empty or value if passed
      parseInt(formObj.filter_cal_min)
        ? (result.calMin = parseInt(formObj.filter_cal_min))
        : (result.calMin = 0);

      // Set 9999 (max possible in DB field) if empty or value if passed
      parseInt(formObj.filter_cal_max)
        ? (result.calMax = parseInt(formObj.filter_cal_max))
        : (result.calMax = 9999);
    }

    // If carbs filter is toggled
    if (formObj.filter_carbs) {
      // Turn filter flag on
      result.filterCarbs = true;

      // Set 0 if empty or value if passed
      parseInt(formObj.filter_carbs_min)
        ? (result.carbsMin = parseFloat(
            parseFloat(formObj.filter_carbs_min).toFixed(2)
          ))
        : (result.carbsMin = 0);

      // Set 999.99 (max possible in DB field) if empty or value if passed
      parseInt(formObj.filter_carbs_max)
        ? (result.carbsMax = parseFloat(
            parseFloat(formObj.filter_carbs_max).toFixed(2)
          ))
        : (result.carbsMax = 999.99);
    }

    // If fat filter is toggled
    if (formObj.filter_fat) {
      // Turn filter flag on
      result.filterFat = true;

      // Set 0 if empty or value if passed
      parseInt(formObj.filter_fat_min)
        ? (result.fatMin = parseFloat(
            parseFloat(formObj.filter_fat_min).toFixed(2)
          ))
        : (result.fatMin = 0);

      // Set 999.99 (max possible in DB field) if empty or value if passed
      parseInt(formObj.filter_fat_max)
        ? (result.fatMax = parseFloat(
            parseFloat(formObj.filter_fat_max).toFixed(2)
          ))
        : (result.fatMax = 999.99);
    }

    // If protein filter is toggled
    if (formObj.filter_protein) {
      // Turn filter flag on
      result.filterProt = true;

      // Set 0 if empty or value if passed
      parseInt(formObj.filter_protein_min)
        ? (result.protMin = parseFloat(
            parseFloat(formObj.filter_protein_min).toFixed(2)
          ))
        : (result.protMin = 0);

      // Set 999.99 (max possible in DB field) if empty or value if passed
      parseInt(formObj.filter_protein_max)
        ? (result.protMax = parseFloat(
            parseFloat(formObj.filter_protein_max).toFixed(2)
          ))
        : (result.protMax = 999.99);
    }

    return result;
  } catch {
    return null;
  }
}

module.exports = {
  dbConnection,
  getIp,
  processRecipeForm,
  validateRecipeForm,
  processSearchForm,
};

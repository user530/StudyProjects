// JSON functionality
const { json } = require("body-parser");
// File system (working with files)
const fs = require(`fs`);
const path = require("path");
// Import helper functions
const helperFunctions = require(`../core/functions`);
// Import functions to work with Database
const dbFunctions = require(`../core/functionsDB`);

module.exports = (app) => {
  // Main page route
  app.get(`/`, async (req, res) => {
    // Prepare data variable
    const data = {};

    // Get the recipe data
    recipes = await dbFunctions.executeQuery(
      `SELECT * FROM \`recipe\` ORDER BY \`recipe_id\``
    );

    // Prepare recipes data
    data.recipes = [];

    // If there are more than 4 recipes in the base
    if (recipes.length > 4) {
      // Prepare the set (non repetative values)
      const indices = new Set();
      // Fill the set of indices to display
      while (indices.size < 4)
        indices.add(Math.floor(Math.random() * recipes.length));
      // Fill the recipe data with 4 random recipes to display
      indices.forEach((ind) => data.recipes.push(recipes[ind]));
    } else data.recipes = recipes;

    // Render passing the data
    res.render(`index.html`, data);
  });

  app.get(`/search`, async (req, res) => {
    // Prepare data variable
    const data = {};

    // If there is status msg cookie
    if (req.cookies?.msg) {
      // Pass it to the data object and clear cookies
      data.msg = req.cookies.msg;
      res.clearCookie(`msg`);
    }

    // Get diets table data
    data.diets = await dbFunctions.executeQuery(`SELECT * FROM \`diets\``);
    // Get ingredients table data
    data.ingredients = await dbFunctions.executeQuery(
      `SELECT \`ingredient_id\`,\`ingredient_name\` FROM \`ingredient\``
    );

    // If search query passed
    if (req.query?.rec) {
      // Turn single param into array manually
      if (typeof req.query.rec === `string`) req.query.rec = [req.query.rec];

      // Prepare query string
      const queryStr = `SELECT * FROM \`recipe\` WHERE \`recipe_id\` IN (${Array(
        req.query.rec.length
      )
        .fill(`?`)
        .join(`,`)})`;

      // Get the data from the DB to visualise search results
      data.recipes = await dbFunctions.executeQuery(queryStr, req.query.rec);
    }

    res.render(`search.html`, data);
  });

  app.post(`/search`, async (req, res) => {
    // Process form
    const filterParams = helperFunctions.processSearchForm(req.body);

    // Failed form
    if (!filterParams) {
      // Add status msg and redirect
      res.cookie(`msg`, `Failed to process the form, please try again!`);
      res.redirect(`/search`);
      // Return to stop execution
      return;
    }

    // Filter the recipe table
    let recFilter = await dbFunctions.filterRecipeTable(filterParams);

    // Failed form
    if (!recFilter) {
      // Add status msg and redirect
      res.cookie(
        `msg`,
        `Failed to process recipe conditions, please try again!`
      );
      res.redirect(`/search`);
      // Return to stop execution
      return;
    }

    // Move to array of Id's that satisfy recipe table filters
    recFilter = recFilter.map((obj) => obj.recipe_id);

    // Diet table filter
    const dietFilter = await dbFunctions.filterTagTable(
      filterParams,
      `recipe_diet`,
      `diet_id`,
      `filterDietIncl`,
      `dietsIncl`,
      `filterDietExcl`,
      `dietsExcl`
    );

    // Failed while filtering recipe-diet table
    if (!dietFilter) {
      // Add status msg and redirect
      res.cookie(`msg`, `Failed to process diet conditions, please try again!`);
      res.redirect(`/search`);
      // Return to stop execution
      return;
    }

    // Ingredient table filter
    const ingrFilter = await dbFunctions.filterTagTable(
      filterParams,
      `recipe_ingredient`,
      `ingredient_id`,
      `filterIngrIncl`,
      `ingredIncl`,
      `filterIngrExcl`,
      `ingredExcl`
    );

    // Failed while filtering recipe-ingredient table
    if (!ingrFilter) {
      // Add status msg and redirect
      res.cookie(
        `msg`,
        `Failed to process ingredient conditions, please try again!`
      );
      res.redirect(`/search`);
      // Return to stop execution
      return;
    }

    // Get the array of IDs that satisfy all conditions
    const allFilter = recFilter.filter(
      (v) => dietFilter.includes(v) && ingrFilter.includes(v)
    );

    // Redirect passing the IDs as request string
    res.redirect(`/search?${allFilter.map((v) => `rec=${v}`).join(`&`)}`);
  });

  // Authorization page route
  app.get(`/authorization`, async (req, res) => {
    // Prepare object for data
    let data = {};

    // If there is status msg cookie
    if (req.cookies?.msg) {
      // Pass it to the data object and clear cookies
      data.msg = req.cookies.msg;
      res.clearCookie(`msg`);
    }

    res.render(`authorization.html`, data);
  });

  // Register route
  app.post(`/register`, async (req, res) => {
    const insert = await dbFunctions.createUser(req.body);
    const data = { msg: insert.msg };

    res.render(`authorization.html`, data);
  });

  // Login route
  app.post(`/login`, async (req, res) => {
    const ip = helperFunctions.getIp(req);

    const login = await dbFunctions.login(req.body, ip);

    // If login is successfull - update cookies
    if (login.status) {
      res.cookie(`id`, login.id, { maxAge: 1000 * 60 * 60 });
      res.cookie(`hash`, login.hash, { maxAge: 1000 * 60 * 60 });

      // Redirect to user page
      res.redirect(`/user/${login.id}`);
    }
    // Reload the authorization page if error
    else {
      // Add status msg and redirect
      res.cookie(`msg`, `Authorization Failed, please try again!`);
      res.redirect(`/authorization`);
    }
  });

  app.get(`^/user/:userId([0-9]{1,12})$`, async (req, res) => {
    // Authenticate
    const auth = await authCheck(req, req.params?.userId);

    // Failed authentication
    if (!auth) {
      // Handle failed authentication and stop execution
      failedAuth(res);
      return;
    }

    // Get user data
    const data = { user: auth, tables: {} };

    // If authorized user have admin access
    if (auth?.role == `admin`) {
      // Redirect to the admin panel
      res.redirect(`/admin`);
    }

    // If authorized user have user access
    if (auth?.role == `user`) {
      // GET USER FAVORITE RECIPES and add them to data
      // Render using data
      res.render(`user.html`, data);
    }
  });

  // Admin panel
  app.get(`/admin`, async (req, res) => {
    // Authenticate
    const authAdmin = await authCheck(req, parseInt(req.cookies?.id), true);

    // Failed authentication
    if (!authAdmin) {
      // Handle failed authentication and stop execution
      failedAuth(res);
      return;
    }

    // Prepare data object
    const tables = {};

    // Get recipe table data
    tables.recipes = await dbFunctions.executeQuery(
      `SELECT \`recipe_id\`, \`recipe_name\` FROM \`recipe\` ORDER BY \`recipe_id\``
    );

    // Render with data
    res.render(`admin.html`, tables);
  });

  // Create recipe
  app.get(`/create/recipe`, async (req, res) => {
    // Authenticate
    const authAdmin = await authCheck(req, parseInt(req.cookies?.id), true);

    // Failed authentication
    if (!authAdmin) {
      // Handle failed authentication and stop execution
      failedAuth(res);
      return;
    }

    // Prepare data storage
    const data = {};

    // If there is status msg cookie
    if (req.cookies?.msg) {
      // Pass it to the data object and clear cookies
      data.msg = req.cookies.msg;
      res.clearCookie(`msg`);
    }

    // Get diets table data
    data.diets = await dbFunctions.executeQuery(`SELECT * FROM \`diets\``);
    // Get ingredients table data
    data.ingredients = await dbFunctions.executeQuery(
      `SELECT \`ingredient_id\`,\`ingredient_name\` FROM \`ingredient\``
    );

    // Render page with data
    res.render(`recipeForm.html`, data);
  });

  app.post(`/create/recipe`, async (req, res) => {
    // Authenticate
    const authAdmin = await authCheck(req, parseInt(req.cookies?.id), true);

    // Failed authentication
    if (!authAdmin) {
      // Handle failed authentication and stop execution
      failedAuth(res);
      return;
    }

    //If admin authorized We try to add new recipe
    try {
      // Process the form and get the data
      const formData = helperFunctions.processRecipeForm(req.body);

      //  If some form fields are missing
      if (!formData) throw `ERROR! Failed to parse the form!`;

      // Validate the form
      if (
        !helperFunctions.validateRecipeForm(
          formData.name,
          formData.preptime,
          formData.diets,
          formData.ingredients,
          formData.units,
          formData.amounts,
          formData.desription,
          formData.steps
        )
      )
        throw `ERROR! Failed to validate the form data!`;

      // Check the image file
      if (!req.file) throw `ERROR! Image file is missing or invalid!`;

      // If recipe has diet tags
      if (formData.diets.length > 0) {
        // Get existing tags
        const diets = await dbFunctions.executeQuery(
          `SELECT \`diet_id\` FROM \`diets\` WHERE \`diet_id\` IN (${Array(
            formData.diets.length
          )
            .fill(`?`)
            .join()})`,
          formData.diets
        );

        // If diets form data is not found in the database
        if (diets instanceof Error) throw `ERROR! Invalid diets data!`;

        // Clean the diets array
        formData.diets = [];

        // Populate with tags that are in DB
        diets.forEach((dietObj) => {
          formData.diets.push(dietObj.diet_id);
        });
      }

      // Prepare the array to confirm that all Ingred and Unit data exists in DB
      let ingrDataArr = [];

      // Populate this array
      for (let i = 0; i < formData.ingredients.length; ++i) {
        ingrDataArr.push({
          ingredientId: formData.ingredients[i],
          unitId: formData.units[i],
          amount: formData.amounts[i],
        });
      }

      // Querry the database
      const q1 = await dbFunctions.selectIngrUnit(ingrDataArr);

      // If invalid ingredient-unit data is passed
      if (!q1 || q1.length != formData.ingredients.length)
        throw `ERROR! Ingredient-unit data error!`;

      // Calculate nutrition data
      const nutrData = await dbFunctions.calculateNutrition(ingrDataArr);

      // Prepare recipe insert query and params
      const queryIns = `INSERT INTO \`recipe\` (\`recipe_name\`, \`recipe_calorie\`, \`recipe_carbs\`, \`recipe_fats\`, \`recipe_prots\`, \`recipe_preptime\`, \`recipe_description\`)
     VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const paramsIns = [
        formData.name,
        nutrData.calories,
        nutrData.carbs,
        nutrData.fats,
        nutrData.proteins,
        formData.preptime,
        formData.desription,
      ];

      // Prepare insert query
      const q2 = await dbFunctions.executeQuery(queryIns, paramsIns);

      // If rectip insertion failed
      if (q2 instanceof Error) {
        // Duplicate entry error
        if (q2.errno == 1062)
          throw `ERROR! Recipe name already in use, try another name`;
        // Another error
        throw `ERROR! Failed to add recipe!`;
      }

      // Get new recipe Id
      const recipeId = q2.insertId;

      // If there are diet tags
      if (formData.diets.length > 0) {
        // Try to insert them
        const insertDiets = await dbFunctions.multiInsert(
          `recipe_diet`,
          [`recipe_id`, `diet_id`],
          formData.diets.map((v) => [recipeId, v])
        );

        // Check the insertion
        if (!insertDiets) throw `ERROR! Failed to add diets!`;
      }

      // Prepare array for ingredient-units
      const ingrUnits = [];
      // Populate ingredient-units ID-s for the insert
      q1.forEach((rowObj) => ingrUnits.push(rowObj.unit_id));

      // Prepare array for parameters
      const ingrParamsArr = [];

      // Populate it
      formData.ingredients.forEach((v, ind) => {
        ingrParamsArr.push([
          recipeId,
          v,
          formData.amounts[ind],
          ingrUnits[ind],
        ]);
      });

      // Try to insert ingredients
      const insertIngredients = await dbFunctions.multiInsert(
        `recipe_ingredient`,
        [`recipe_id`, `ingredient_id`, `ingredient_amount`, `unit_id`],
        ingrParamsArr
      );

      // Handle ingredients insertion error
      if (!insertIngredients) throw `ERROR! Failed to add ingredients!`;

      // Prepare param array for the steps insertion
      const stepParamsArr = [];
      // Populate it
      formData.steps.forEach((v, ind) => {
        stepParamsArr.push([recipeId, ind + 1, v]);
      });

      // Try to insert steps
      const insertSteps = await dbFunctions.multiInsert(
        `recipe_steps`,
        [`recipe_id`, `step_no`, `step_description`],
        stepParamsArr
      );

      // Handle steps insertion error
      if (!insertSteps) throw `ERROR! Failed to add steps!`;

      // If no errors occured in the process rename file, set name equal to ID
      fs.renameSync(req.file.path, `${req.file.destination}${recipeId}.jpg`);

      // Redirect to the new recipe page
      res.redirect(`/recipe/${recipeId}`);
    } catch (err) {
      // Delete file if something been uploaded
      if (req.file)
        fs.unlinkSync(`${req.file.destination}${req.file.filename}`);

      // Add status msg and redirect
      res.cookie(`msg`, err);

      // Redirect back to the create recipe page and SHOW ERRORS!
      res.redirect(`/create/recipe`);
    }
  });

  app.get(`^/delete/recipe/:recipeId([0-9]{1,12})$`, async (req, res) => {
    // Authenticate
    const authAdmin = await authCheck(req, parseInt(req.cookies?.id), true);

    // Failed authentication
    if (!authAdmin) {
      // Handle failed authentication and stop execution
      failedAuth(res);
      return;
    }

    // Recipe ID
    const recId = req.params.recipeId;

    // Delete recipe
    const delRecipe = await dbFunctions.executeQuery(
      `DELETE FROM \`recipe\` WHERE \`recipe_id\`=?`,
      [recId]
    );

    // Delete diets
    const delDiets = await dbFunctions.executeQuery(
      `DELETE FROM \`recipe_diet\` WHERE \`recipe_id\`=?`,
      [recId]
    );

    // Delete ingredients
    const delIngred = await dbFunctions.executeQuery(
      `DELETE FROM \`recipe_ingredient\` WHERE \`recipe_id\`=?`,
      [recId]
    );

    // Delete steps
    const delSteps = await dbFunctions.executeQuery(
      `DELETE FROM \`recipe_steps\` WHERE \`recipe_id\`=?`,
      [recId]
    );

    // If recipe been deleted from the DB, delete the file
    if (
      delRecipe.affectedRows &&
      fs.existsSync(`./public/img/recipes/${recId}.jpg`)
    )
      fs.unlinkSync(`./public/img/recipes/${recId}.jpg`);

    // Redirect back to admin page
    res.redirect(`/admin`);
  });

  app.get(`^/recipe/:recipeId([0-9]{1,11})$`, async (req, res) => {
    // Get the data about the recipe
    const recipe = await dbFunctions.select(
      `recipe`,
      `recipe_id`,
      req.params?.recipeId
    );

    // Get the data about the steps
    const steps = await dbFunctions.getSteps(req.params?.recipeId);

    // Get the data about the ingredients
    const ingredients = await dbFunctions.getIngredients(req.params?.recipeId);

    // Get the data about the ingredients
    const diets = await dbFunctions.getDiets(req.params?.recipeId);

    // If all data is set
    if (recipe && steps && ingredients) {
      // Prepare data object
      const data = {
        recipe_id: recipe.recipe_id,
        recipe_name: recipe.recipe_name,
        recipe_cal: recipe.recipe_calorie,
        recipe_carbs: recipe.recipe_carbs,
        recipe_fats: recipe.recipe_fats,
        recipe_prots: recipe.recipe_prots,
        recipe_time: recipe.recipe_preptime,
        recipe_descr: recipe.recipe_description,
        recipe_steps: [],
        recipe_ingredients: [],
        recipe_diets: [],
      };

      // Fill steps
      for (const stepObj of steps)
        data.recipe_steps.push(stepObj.step_description);

      // Fill ingredients
      for (const ingredientObj of ingredients)
        data.recipe_ingredients.push(
          `${ingredientObj.ingredient_name} - ${ingredientObj.ingredient_amount} ${ingredientObj.unit_name}`
        );

      // If there are diet tags for the recipe
      if (diets)
        // Fill diets
        for (const dietObj of diets) data.recipe_diets.push(dietObj.diet_name);

      // Render with data
      res.render(`recipe.html`, data);
    }
    // Some data is missing
    else {
      // Cant find correct recipe page, redirect
      res.redirect(`/404`);
    }
  });

  // Helper route to get unit data according to the id from the DB
  app.post(`/get/units`, async (req, res) => {
    // Get the units data and send it back
    const units = await dbFunctions.getUnitsForIngr(req.body.ingrId);
    res.send(units);
  });

  // Helper route to get nutr facts according to the ids
  app.post(`/get/nutrients`, async (req, res) => {
    // If correct request formulated
    if (req.body.length > 0) {
      // Calculate the nutrition data and send it back
      const nutr = await dbFunctions.calculateNutrition(req.body);
      res.send(nutr);
    } else res.send(null);
  });

  // Helper route to get recipes similar to the search string
  app.post(`/get/recipes`, async (req, res) => {
    // Get the search string
    const search = String(req.body?.search).trim();

    // Prepare 'default' query
    let query = `SELECT * FROM \`recipe\` ORDER BY \`recipe_id\` LIMIT 10`;

    // Change query based on the search string
    if (search.length > 0)
      query = `SELECT * FROM \`recipe\` WHERE \`recipe_name\` LIKE ?`;

    // Get the data
    const q = await dbFunctions.executeQuery(query, [`%${search}%`]);

    // Return the data
    res.send(q);
  });

  // Error request
  app.use(`/404`, (req, res) => {
    res.render(`404.html`);
  });

  // Handle non existing requests
  app.use((req, res) => {
    res.status(404).redirect(`/404`);
  });

  // Handle error
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send(`Unexpected error`);
  });
};

// Helper function to check the user/admin
async function authCheck(req, id, adminCheck = false) {
  // Get user ip
  const ip = helperFunctions.getIp(req);
  // Check autharization
  const user = await dbFunctions.getUser(req.cookies, id, ip);

  // Reture result of user or admin check
  if (!adminCheck) return user;
  else return user && user.role == `admin`;
}

// Helper function to handle failed authentication
function failedAuth(res) {
  // Clear Auth cookies and add status msg
  res.clearCookie(`id`);
  res.clearCookie(`hash`);

  res.cookie(`msg`, `Authorization Failed, please try again!`);

  // Redirect to auth page
  res.redirect(`/authorization`);
}

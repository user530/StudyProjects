(function () {
  console.log(`SCRIPT JS ACTIVATED!`);

  mobMenuResize();
})();

// Helper function to toggle between Register and Login forms
function toggleForms() {
  // Both form elements
  const forms = document.querySelectorAll(`.form_block`);

  // Iterate over elements and toggle active class
  for (const form of forms) {
    form.classList.toggle(`form_active`);
  }
}

// Helper function to get recipe data based on the filter value
function requestRecipeCards(searchVal) {
  // Create request
  const req = new XMLHttpRequest();

  // Setup request
  req.open(`POST`, `/get/recipes`);
  req.setRequestHeader(`Content-type`, `application/x-www-form-urlencoded`);

  // On successful response
  req.onload = () => {
    // Create cards based on the search
    showRecipe(JSON.parse(req.response));
  };

  // Send request with search field data
  req.send(`search=${searchVal}`);
}

// Helper function to visualise the data
function showRecipe(recipeData) {
  // Get the recipe wrapper
  const wrapper = document.querySelector(`#recipes`);

  // Check argument
  if (!(recipeData instanceof Array)) return null;

  // If data is good, clear the wrapper
  wrapper.innerHTML = ``;

  // Iterate over the data
  for (const recipeObj of recipeData) {
    // Create recipe card HTML
    const recipeCardHTML = `<a href="recipe/${recipeObj.recipe_id}" class="recipes-card">
    <span class="card-span">Read more</span>
    <div class="recipes-card__img">
      <img
        src="img/recipes/${recipeObj.recipe_id}.jpg"
        alt="${recipeObj.recipe_name}"
        
      />
    </div>
    <div class="recipes-card__desk">
      <h3 class="title-3">${recipeObj.recipe_name}</h3>
      <p>${recipeObj.recipe_description}</p>
    </div>
    <div class="recipes-card__table">
      <table>
        <tr>
          <th>Calories</th>
          <th>Carbs</th>
          <th>Fat</th>
          <th>Protein</th>
        </tr>
        <tr>
          <td>${recipeObj.recipe_calorie} Cal.</td>
          <td>${recipeObj.recipe_carbs} g/100g</td>
          <td>${recipeObj.recipe_fats} g/100g</td>
          <td>${recipeObj.recipe_prots} g/100g</td>
        </tr>
      </table>
    </div>
    </a>`;

    // Add it to the wrapper
    wrapper.insertAdjacentHTML(`beforeend`, recipeCardHTML);
  }
}

// Helper to add (duplicate) selector element
function addOptionTag(btnSelector, tagSelector) {
  // Shortcut to btn element
  const btn = document.querySelector(btnSelector);
  // Find the original diet element
  const dietEl = document.querySelector(tagSelector);
  // Copy it
  const dietElNew = dietEl.cloneNode(true);
  // Add it to the diet wrapper
  btn.insertAdjacentElement("beforebegin", dietElNew);
}

// Helper to add (duplicate) ingredient selector element
function addIngredient() {
  // Shortcut to btn element
  const btn = document.querySelector("#addIngrBtn");
  // Find the original ingredient row
  const ingrRow = document.querySelector(".ingredient-row");
  // Copy it
  const ingrRowNew = ingrRow.cloneNode(true);

  // Clean the ingredient amount value if any
  ingrRowNew.querySelector(".ingredient_amount").value = "";
  // Clean the ingredient unit field if any
  ingrRowNew.querySelector(".unit").innerHTML = "";

  // Add it to the ingredient wrapper
  btn.insertAdjacentElement("beforebegin", ingrRowNew);
}

// Helper function to get units for the selected ingredient
function getUnits(ingrId, element) {
  // Shortcut for the unit select element
  const unitSelectElement = element.parentElement.querySelector(".unit");
  // Clear the unit select
  unitSelectElement.innerHTML = "";

  // Create req object
  const req = new XMLHttpRequest();
  // Open post request to retrieve units
  req.open("POST", "/get/units");

  // Setup req header
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // When req is loaded
  req.onload = function () {
    // Iterate over number of units
    for (let unitObj of JSON.parse(req.response)) {
      // Create option with unit data
      const optionEl = document.createElement("option");
      optionEl.value = unitObj.unit_id;
      optionEl.innerText = unitObj.unit_name;

      // Add option to the select
      unitSelectElement.insertAdjacentElement("beforeend", optionEl);
    }

    // In the end, update nutrition data
    calculateNutr();
  };

  // Send req passing required Ingredient ID
  req.send(`ingrId=${ingrId}`);
}

// Helper functions to add step elements
function addStep() {
  // Shortcut to btn element
  const btn = document.querySelector("#addStepBtn");
  // Find the original steps row
  const stepRow = document.querySelector(".step_row");
  // Copy it
  const stepRowNew = stepRow.cloneNode(true);
  // Clean step values if any
  for (const step of stepRowNew.children) {
    step.value = "";
  }
  // Add it to the ingredient wrapper
  btn.insertAdjacentElement("beforebegin", stepRowNew);
}

// Calculate nutrition based on all ingredient
function calculateNutr() {
  const ingredients = document.querySelectorAll(".ingredient");
  const units = document.querySelectorAll(".unit");
  const amounts = document.querySelectorAll(".ingredient_amount");

  const reqData = [];
  // Iterate over every ingredient
  ingredients.forEach((val, key) => {
    const ingrId = +ingredients[key].value;
    const ingrUnitId = +units[key].value;
    const ingrAmnt = +amounts[key].value;

    // If all data is ok
    if (ingrId != 0 && ingrAmnt != 0 && ingrUnitId != 0)
      reqData.push({
        ingredientId: ingrId,
        unitId: ingrUnitId,
        amount: ingrAmnt,
      });
  });

  getNutr(reqData);
}

// Helper function to get nutrition values (and then display them)
function getNutr(reqData) {
  // Create req object
  const req = new XMLHttpRequest();
  // Open get request to retrieve units based on the
  req.open("POST", "/get/nutrients");

  // Setup req header
  req.setRequestHeader("Content-type", "application/json");

  // When req is loaded
  req.onload = function () {
    // Get the data
    const data = JSON.parse(req.response);
    // Update the nutrition data
    setNutrition(data.calories, data.carbs, data.fats, data.proteins);
  };

  // Send req passing request data as JSON
  req.send(JSON.stringify(reqData));
}

// Helper function to set nutrition values to DOM elements
function setNutrition(calories, carbs, fats, proteins) {
  document.querySelector(`#calories`).value = calories;
  document.querySelector(`#carbs`).value = carbs;
  document.querySelector(`#fats`).value = fats;
  document.querySelector(`#proteins`).value = proteins;
}

// Helper function to toggle mobile menu
function mobMenuClick(menuElem, event) {
  // Elements
  const mobileMenu = document.querySelector("#navMenu");
  const overlayBlock = document.querySelector("#overlay");
  const bodyEl = document.body;

  // Stop default activity
  event.stopPropagation();

  // Switch active class to toggle visibility
  if (menuElem.classList.contains("active")) {
    menuElem.classList.remove("active");
    mobileMenu.classList.remove("active");
    overlayBlock.classList.remove("active");
    bodyEl.classList.remove("noscroll");
  } else {
    menuElem.classList.add("active");
    mobileMenu.classList.add("active");
    overlayBlock.classList.add("active");
    bodyEl.classList.add("noscroll");
  }
}

// Helper function to handle mobile platform
function mobMenuResize() {
  // Elements
  const menuToggle = document.querySelector("#menu-toggle");
  const mobileMenu = document.querySelector("#navMenu");
  const overlayBlock = document.querySelector("#overlay");
  const bodyEl = document.body;

  // Handle window resize
  window.addEventListener("resize", function () {
    if (this.innerWidth > 1199) {
      if (mobileMenu.classList.contains("active")) {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
        overlayBlock.classList.remove("active");
        bodyEl.classList.remove("noscroll");
      }
    }
  });
}

// Helper function to close message window
function closeChips(chipsElem) {
  chipsElem.closest(".notify-chips").style.display = "none";
}

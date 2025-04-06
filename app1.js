
// script.js
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipecloseBtn = document.querySelector('.recipe-close-btn');
const overlay = document.querySelector('.overlay');

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    if (!response.meals) {
      recipeContainer.innerHTML = "<h2>No recipes found. Try something else!</h2>";
      return;
    }

    recipeContainer.innerHTML = "";

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;

      const button = document.createElement('button');
      button.textContent = "View Recipe";
      button.addEventListener('click', () => openRecipePopUp(meal));

      recipeDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error fetching data. Please try again later.</h2>";
    console.error(error);
  }
};

const openRecipePopUp = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${getIngredientsList(meal)}</ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
  `;
  document.querySelector('.recipe-details').style.display = "block";
  overlay.style.display = "block";
};

const getIngredientsList = (meal) => {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  return ingredients;
};

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchRecipes(searchInput);
  }
});

recipecloseBtn.addEventListener('click', () => {
  document.querySelector('.recipe-details').style.display = "none";
  overlay.style.display = "none";
});

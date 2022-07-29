import * as model from './model.js'; // naming export
import recipeView from './models/recipeView.js'; // default export
import searchView from './models/searchView.js';
import resultsView from './models/resultsView.js';
import paginationView from './models/paginationView.js';
import bookmarksView from './models/bookmarksView.js';
import addRecipeView from './models/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';

// make the application available for all browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // get hashing form url
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0 - update resultsView, check if selected
    resultsView.update(model.getSearchResultsPage());

    // 1- update bookmark view
    bookmarksView.update(model.state.bookmarks); // see later

    // (2)- loading spinner
    recipeView.renderSpinner();

    // (1)- Loading recipe
    await model.loadRecipe(id);

    // (2)- render recipe in view
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // load spinner
    resultsView.renderSpinner();

    // 1- get query from input
    const query = searchView.getQuery();

    if (!query) return;

    // 2- load search results
    await model.loadSearchResults(query);

    // 3- render results
    resultsView.render(model.getSearchResultsPage());

    // 4- initialize pagination
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error);
  }
};

const controlPagination = function (goToPage) {
  // 1- render new page results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2- render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe serving from the state
  model.updateServings(newServings);

  // upadate recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // 1- add/remove bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log('bookmarked', model.state.recipe);
  // 2- updated recipe view
  recipeView.update(model.state.recipe);

  // 3- render bookmark view
  bookmarksView.render(model.state.bookmarks);
};

const controlLoadBookmarks = function () {
  // load bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0- load spinner
    addRecipeView.renderSpinner();

    // 1- upload new recipe
    await model.uploadRecipe(newRecipe);

    // console.log(model.state.recipe);

    // 2- render newRecipe in view
    recipeView.render(model.state.recipe);

    // 3- render success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // chande id in the url
    window.history.pushState(null, '', `/#${model.state.recipe.id}`);

    // 4- close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

// handling event handler from the view (Subscriber)
// -- the init function, is in control
const init = function () {
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipe);
};

init();

//////////////////////////////////////////////////////////////////////////////////

// -- the init function has no control, just execute the function inside the input
// const init = function (handler) {
//   return recipeView.addHandlerRender(handler);
// };

// init(controlRecipes);

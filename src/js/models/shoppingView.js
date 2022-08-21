import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { API_KEY } from '../config.js';

class ShoppingView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage = 'Empty cart. Find a nice recipe and shopped it :)';
  _message = '';

  addHandlerRender(handler) {
    // load shopping list
    window.addEventListener('load', handler);
  }

  addHandlerDeleteRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const deleteBtn = e.target.closest('.delete__btn--item');

      if (!deleteBtn) return;

      const recipeId = deleteBtn.dataset.id;

      handler(recipeId);
    });
  }

  _generateMarkup() {
    return this._data.map(this._generateShopItemMarkup).join('');
  }

  _generateShopItemMarkup(item) {
    const id = window.location.hash.slice(1);

    return `
    <li class="item">
      <div class="shopping__item ${
        item.id === id ? 'shopping__link--active' : ''
      }" >
        <figure class="shopping__fig">
          <img src="${item.image}" alt="${item.title}" />
        </figure>
        <div class="shopitem">
          <a class="shopping__link" href="#${item.id}">
            <h4 class="shopping__title">${item.title}</h4>
          </a>
          <p class="shopping__publisher">${item.publisher}</p>
          <div class="shopping__user-generated ${
            item.key === API_KEY ? '' : 'hidden'
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
        <button class="delete__btn delete__btn--item" data-id="${
          item.id
        }">&times;</button>
      </div>
    </li>
  `;
  }
}

export default new ShoppingView();

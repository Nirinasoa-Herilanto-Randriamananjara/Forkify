import icons from 'url:../../img/icons.svg';

// Parent view
class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (ex: recipe)
   * @param {boolean} [ display = true] If false, create a markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View instance
   * @author Nirinasoa Herilanto
   * @todo implementation finished
   */
  render(data, display = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    // avoid re-render of markup
    if (!display) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Use to avoid flickering image, etc... in view
   */
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    // convert to virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // compare
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // * update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // * update changed attributes,
      // replace all attributes from curEl by the attributes coming from the newEl
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    // clear container
    this._parentElement.innerHTML = '';
  }
}

export default View;

class SearchView {
  _parentEl = document.querySelector('.search');

  /**
   * use to get a query terms from input search
   * @returns query terms
   */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();

    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();

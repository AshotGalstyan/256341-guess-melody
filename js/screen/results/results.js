import ResultsView from './results-view.js';

export default class ResultsScreen {

  constructor(router, data) {

    const resultsView = new ResultsView(data);

    this._element = resultsView.element;

    resultsView.getUserAction()
      .then(() => {
        router.showGame();
      });
  }

  get element() {
    return this._element;
  }
}

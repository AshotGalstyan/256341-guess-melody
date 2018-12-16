import WelcomeView from './welcome-view.js';

export default class WelcomeScreen {

  constructor(router, withPreloader = false) {

    this._withPreloader = withPreloader;

    const welcomeView = new WelcomeView(withPreloader);

    this._view = welcomeView;
    this._element = welcomeView.element;

    welcomeView.getUserAction()
      .then(() => {
        router.showGame();
      });
  }

  get element() {
    return this._element;
  }

  hidePreloader() {
    if (this._withPreloader) {
      this._view.hidePreloader();
    }
  }
}

import WelcomeView from './welcome-view.js';

export default class WelcomeScreen {

  constructor(router) {

    this.root = new WelcomeView();

    this.root.onClick = () => {
      this.root.unbind();
      router.showGame();
    };
  }

  get element() {
    return this.root.element;
  }

  hidePreloader() {
    this.root.hidePreloader();
  }
}

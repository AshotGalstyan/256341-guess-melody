import AbstractView from '../../common/abstract-view.js';

export default class LogoView extends AbstractView {

  get wrapperTag() {
    return `a`;
  }
  get wrapperAttributes() {
    return {class: `game__back`, href: `#`};
  }
  get template() {
    return `
      <span class="visually-hidden">Сыграть ещё раз</span>
      <img class="game__logo" src="img/melody-logo-ginger.png" alt="Угадай мелодию">
      `;
  }

  bind() {
    this.backButton = this.element;
    this.backButton.addEventListener(`click`, this.onClick);
  }

  unbind() {
    this.backButton.removeEventListener(`click`, this.onClick);
  }

  onClick() {}

}

import AbstractView from '../../common/abstract-view.js';

export default class IntroView extends AbstractView {

  get wrapperTag() {
    return `section`;
  }

  get wrapperAttributes() {
    return {class: `welcome`};
  }

  get template() {
    return `
      <div class="welcome__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
      <div class="welcome__preloader"></div>
      <button class="welcome__button welcome__button-hide"><span class="visually-hidden">Начать игру</span></button>
      <h2 class="welcome__rules-title">Правила игры</h2>
      <p class="welcome__text">Правила просты:</p>
      <ul class="welcome__rules-list">
        <li>За 5 минут нужно ответить на все вопросы.</li>
        <li>Можно допустить 3 ошибки.</li>
      </ul>
      <p class="welcome__text">Удачи!</p>
    `;
  }

  bind() {
    this.preloader = this.element.querySelector(`.welcome__preloader`);
    this.nextButton = this.element.querySelector(`.welcome__button`);
    this.nextButton.addEventListener(`click`, this.onClick);
  }

  unbind() {
    this.nextButton.removeEventListener(`click`, this.onClick);
  }

  onClick() {}

  hidePreloader() {
    this.nextButton.classList.remove(`welcome__button-hide`);
    this.preloader.classList.add(`welcome__preloader-hide`);
  }
}

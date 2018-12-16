import AbstractView from '../../common/abstract-view.js';

export default class WelcomeView extends AbstractView {

  constructor(withPreloader) {

    super();

    this.preloader = (withPreloader ? `<div class="welcome__preloader"></div>` : ``);
    this.additionalClass = (withPreloader ? `welcome__button-hide` : ``);

  }

  get wrapperTag() {
    return `section`;
  }

  get wrapperAttributes() {
    return {class: `welcome`};
  }

  get template() {
    return `
      <div class="welcome__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
      ${this.preloader}
      <button class="welcome__button ${this.additionalClass}"><span class="visually-hidden">Начать игру</span></button>
      <h2 class="welcome__rules-title">Правила игры</h2>
      <p class="welcome__text">Правила просты:</p>
      <ul class="welcome__rules-list">
        <li>За 5 минут нужно ответить на все вопросы.</li>
        <li>Можно допустить 3 ошибки.</li>
      </ul>
      <p class="welcome__text">Удачи!</p>
    `;
  }

  getUserAction() {
    return new Promise((resolve) => {
      const nextButton = this.element.querySelector(`.welcome__button`);

      nextButton.addEventListener(`click`, function handleNextButtonClick() {
        nextButton.removeEventListener(`click`, handleNextButtonClick);
        resolve();
      });
    });
  }

  hidePreloader() {
    const preloader = this.element.querySelector(`.welcome__preloader`);
    const nextButton = this.element.querySelector(`.welcome__button`);

    nextButton.classList.remove(`welcome__button-hide`);
    preloader.classList.add(`welcome__preloader-hide`);
  }
}

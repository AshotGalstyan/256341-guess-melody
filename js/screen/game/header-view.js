import AbstractView from '../../common/abstract-view.js';
import {getRadius} from '../../common/utilites.js';
import {CRITICAL_TIME, MAX_TIME_LIMIT, RADIUS} from '../../common/constants.js';

export default class HeaderView extends AbstractView {

  constructor(timer, wrongCount) {

    super();

    const minutes = Math.floor(timer / 60);
    const seconds = timer - minutes * 60;

    this._circleStyleStroke = (timer < CRITICAL_TIME ? `; stroke: red;` : ``);
    this._timerTabloClass = (timer < CRITICAL_TIME ? ` timer__value--finished` : ``);

    this._timerTablo = `
      <span class="timer__mins">${(minutes < 10 ? `0` + minutes : minutes)}</span>
      <span class="timer__dots">:</span>
      <span class="timer__secs">${(seconds < 10 ? `0` + seconds : seconds)}</span>
    `;
    this._radius = getRadius(timer / MAX_TIME_LIMIT, RADIUS);

    this._wrongTablo = `<div class="wrong"></div>`.repeat(wrongCount);
  }

  get wrapperTag() {
    return `header`;
  }
  get wrapperAttributes() {
    return {class: `game__header`};
  }
  get template() {
    return `
      <a class="game__back" href="#">
        <span class="visually-hidden">Сыграть ещё раз</span>
        <img class="game__logo" src="img/melody-logo-ginger.png" alt="Угадай мелодию">
      </a>

      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle class="timer__line" cx="390" cy="390" r="370"
          style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center${this._circleStyleStroke}"
          stroke-dasharray="${this._radius.stroke}" stroke-dashoffset="${this._radius.offset}"
        />
      </svg>

      <div class="timer__value${this._timerTabloClass}" xmlns="http://www.w3.org/1999/xhtml">
        ${this._timerTablo}
      </div>

      <div class="game__mistakes">
        ${this._wrongTablo}
      </div>
      `;
  }

  getUserAction() {
    return new Promise((resolve) => {
      const backButton = this.element.querySelector(`.game__back`);

      backButton.addEventListener(`click`, function handleBackButtonClick() {
        backButton.removeEventListener(`click`, handleBackButtonClick);
        resolve();
      });
    });
  }
}

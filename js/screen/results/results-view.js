import AbstractView from '../../common/abstract-view.js';
import {getScore, groupAnswers, resultsToText} from '../../common/utilites.js';
import {MAX_TIME_LIMIT, TOTAL_STEPS} from '../../common/constants.js';

export default class ResultsView extends AbstractView {

  constructor(data) {

    super();

    this.data = data;

    const lastTime = data[0].time;
    const lastAnswers = data[0].answers;
    const lastScore = getScore(lastAnswers);
    const lastGroupAnswers = groupAnswers(lastAnswers);

    if (lastTime === MAX_TIME_LIMIT && lastAnswers.length < TOTAL_STEPS) {

      this.title = `Увы и ах!`;
      this.description = `<p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`;

    } else if (lastAnswers.length < TOTAL_STEPS) {

      this.title = `Какая жалость!`;
      this.description = `<p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`;

    } else {

      this.title = `Вы настоящий меломан!`;
      this.description = `
      <p class="result__total">${resultsToText(lastTime, lastScore, lastGroupAnswers.fast, lastGroupAnswers.wrong)}</p>
      <p class="result__text">Вы заняли 2 место из 10. Это лучше чем у 80% игроков</p>
      `;
    }
  }

  get wrapperTag() {
    return `section`;
  }

  get wrapperAttributes() {
    return {class: `result`};
  }

  get template() {
    return `
      <div class="result__logo"><img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"></div>
      <h2 class="result__title">${this.title}</h2>
      ${this.description}
      ${this.data[0].time + ` ` + JSON.stringify(this.data[0].answers)}
      <button class="result__replay" type="button">Сыграть ещё раз</button>
    `;
  }

  getUserAction() {
    return new Promise((resolve) => {
      const nextButton = this.element.querySelector(`.result__replay`);

      nextButton.addEventListener(`click`, function handleNextButtonClick() {
        nextButton.removeEventListener(`click`, handleNextButtonClick);
        resolve();
      });
    });
  }
}

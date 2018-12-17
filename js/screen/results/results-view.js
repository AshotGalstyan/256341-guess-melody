import AbstractView from '../../common/abstract-view.js';
import {getScore, groupAnswers, timeToText, scoreToText, fastCountToText, wrongCountToText, compareScores} from '../../common/utilites.js';
import {MAX_TIME_LIMIT, TOTAL_STEPS} from '../../common/constants.js';

export default class ResultsView extends AbstractView {

  constructor(data) {

    super();

    this.data = data;

    const [last, ...others] = this.data;

    const lastTime = last.time;
    const lastAnswers = last.answers;
    const lastScore = getScore(lastAnswers);
    const lastGroupAnswers = groupAnswers(lastAnswers);

    const otherScores = others.map((el) => getScore(el.answers)).sort((a, b) => b - a);

    if (lastTime === MAX_TIME_LIMIT && lastAnswers.length < TOTAL_STEPS) {

      this.title = `Увы и ах!`;
      this.description = `<p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`;

    } else if (lastAnswers.length < TOTAL_STEPS) {

      this.title = `Какая жалость!`;
      this.description = `<p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`;

    } else {

      this.title = `Вы настоящий меломан!`;
      this.description = `
      <p class="result__total">За ${timeToText(lastTime)} вы набрали ${scoreToText(lastScore)} (${fastCountToText(lastGroupAnswers.fast)}), совершив ${wrongCountToText(lastGroupAnswers.wrong)}</p>
      <p class="result__text">${compareScores(lastScore, otherScores)}</p>
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

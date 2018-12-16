import {POINTS, FAST_ANSWER_LIMIT, TOTAL_STEPS} from './constants.js';

export const getScore = (answers) => {

  if (!(answers instanceof Array)) {
    return -1;
  }

  if (answers.length !== TOTAL_STEPS) {
    return -1;
  }

  return answers.reduce((total, current) => {
    if (current === -1) {
      return total + POINTS.wrong;
    }

    if (current < FAST_ANSWER_LIMIT) {
      return total + POINTS.fast;
    }

    return total + POINTS.correct;
  }, 0);

};

export const groupAnswers = (answers) => {

  const fast = answers.filter((el) => el < FAST_ANSWER_LIMIT && el > -1).length;
  const wrong = answers.filter((el) => el === -1).length;

  return {fast, wrong};

};

export const resultsToText = (time, score, fastCount, wrongCount) => {

  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  const textAnd = (minutes > 0 && seconds > 0 ? ` и ` : ``);
  const textMinutes = (minutes > 0 ? declinationOfNumber(minutes, [`минуту`, `минуты`, `минут`]) : ``);
  const textSeconds = (seconds > 0 ? declinationOfNumber(seconds, [`секунду`, `секунды`, `секунд`]) : ``);
  const textScore = declinationOfNumber(score, [`балл`, `балла`, `баллов`]);
  const textFast = declinationOfNumber(fastCount, [`быстрый`, `быстрых`, `быстрых`]);
  const textWrong = declinationOfNumber(wrongCount, [`ошибку`, `ошибки`, `ошибок`]);

  return `За ${textMinutes}${textAnd}${textSeconds} вы набрали ${textScore} (${textFast}), совершив ${textWrong}`;

};

export const declinationOfNumber = (number, titles) => {

  // https://punbbinfo.000webhostapp.com/t-287.html

  const cases = [2, 0, 1, 1, 1, 2];

  if (number % 100 > 4 && number % 100 < 20) {
    return number + ` ` + titles[2];
  }

  if (number % 10 < 5) {
    return number + ` ` + titles[cases[number % 10]];
  }

  return number + ` ` + titles[5];

};

export const render = (inner, wrapperTag = `div`, wrapperAttributes = {}) => {
  const wrapper = document.createElement(wrapperTag);
  for (const key in wrapperAttributes) {
    if (wrapperAttributes.hasOwnProperty(key)) {
      wrapper.setAttribute(key, wrapperAttributes[key]);
    }
  }
  if (inner instanceof Array) {
    const fragment = document.createDocumentFragment();
    inner.forEach((element) => fragment.appendChild(element));
    wrapper.appendChild(fragment);
  } else {
    wrapper.innerHTML = inner.trim();
  }
  return wrapper;
};

import {POINTS, FAST_ANSWER_LIMIT, TOTAL_STEPS} from './constants.js';

export const getRadius = (ratio, radius) => {

  const stroke = Math.round(2 * Math.PI * radius);
  const offset = stroke - Math.round(stroke * ratio);

  return {
    stroke,
    offset,
  };
};

export const compareScores = (lastScore, otherScores) => {

  let message = `Вы заняли последнее место из ${(otherScores.length + 1)} игроков. Это худший результат.`;

  for (let i = 0; i < otherScores.length; i++) {
    if (lastScore > otherScores[i]) {
      message = `Вы заняли ${i + 1} место из ${(otherScores.length + 1)} игроков. Это лучше, чем у ${Math.floor(100 * (otherScores.length - i) / (otherScores.length + 1))}% игроков.`;
      break;
    }
  }

  return message;

};

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

export const timeToText = (time) => {

  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  const textAnd = (minutes > 0 && seconds > 0 ? ` и ` : ``);
  const textMinutes = (minutes > 0 ? declinationOfNumber(minutes, [`минуту`, `минуты`, `минут`]) : ``);
  const textSeconds = (seconds > 0 ? declinationOfNumber(seconds, [`секунду`, `секунды`, `секунд`]) : ``);

  return textMinutes + textAnd + textSeconds;

};

export const scoreToText = (score) => declinationOfNumber(score, [`балл`, `балла`, `баллов`]);

export const fastCountToText = (fastCount) => declinationOfNumber(fastCount, [`быстрый`, `быстрых`, `быстрых`]);

export const wrongCountToText = (wrongCount) => declinationOfNumber(wrongCount, [`ошибку`, `ошибки`, `ошибок`]);

export const declinationOfNumber = (number, titles) => {

  const cases = [2, 0, 1, 1, 1, 2];

  if (number % 100 > 4 && number % 100 < 20) {
    return number + ` ` + titles[2];
  }

  if (number % 10 < 5) {
    return number + ` ` + titles[cases[number % 10]];
  }

  return number + ` ` + titles[2];

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

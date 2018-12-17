import AbstractView from '../../common/abstract-view.js';
import {DEBUG} from '../../common/constants.js';

const playStopAudio = (evt) => {

  const context = evt.target.parameters.context.element;
  const button = evt.target;
  const audio = context.querySelector(`#${button.id.replace(`control-`, `audio-`)}`);
  const allAudios = context.querySelectorAll(`audio`);

  if (button.classList.contains(`track__button--play`)) {

    allAudios.forEach((el) => {
      if (!el.paused) {
        const playedId = el.id.substr(6);
        const playedButton = context.querySelector(`#control-` + playedId);
        playedButton.classList.replace(`track__button--pause`, `track__button--play`);
        el.pause();
      }
    });
    button.classList.replace(`track__button--play`, `track__button--pause`);
    audio.play();
  } else {
    button.classList.replace(`track__button--pause`, `track__button--play`);
    audio.pause();
  }
};

const activateSubmitButton = (evt) => {

  const submitButton = evt.target.parameters.submitButton;
  const checkedCheckboxes = submitButton.parentNode.querySelectorAll(`.game__input:checked`);

  submitButton.disabled = (checkedCheckboxes.length > 0 ? false : true);

};

const handleSubmitButtonClick = (evt) => {

  evt.preventDefault();
  evt.target.removeEventListener(`click`, handleSubmitButtonClick);

  const checkboxes = evt.target.parameters.checkboxes;
  checkboxes.forEach((el) => el.removeEventListener(`click`, activateSubmitButton));

  const context = evt.target.parameters.context;
  const trueAnswers = context.trueAnswers;
  const checkedCheckboxes = [...context.element.querySelectorAll(`.game__input:checked`)];

  if (checkedCheckboxes.length === trueAnswers.length && checkedCheckboxes.every((el) => trueAnswers.includes(el.value))) {
    evt.target.parameters.resolve();
  } else {
    evt.target.parameters.reject();
  }
};

export default class GenreView extends AbstractView {

  constructor(nom, question, genre, answers, trueAnswers, mediaFiles) {

    super();

    this.nom = nom;
    this.question = question;
    this.genre = genre;
    this.answers = answers;
    this.trueAnswers = trueAnswers;
    this.mediaFiles = mediaFiles;
  }

  get wrapperTag() {
    return `section`;
  }
  get wrapperAttributes() {
    return {class: `game__screen`};
  }

  get template() {
    return `
      <h2 class="game__title">#${this.nom} : ${this.question}</h2>
      <form class="game__tracks">
        ${this.answers.map((answer, it) => `
        <div class="track">
          <button class="track__button track__button--play" type="button" id="control-${it}"></button>
          <div class="track__status">
            <audio src="${answer.src}" preload="metadata" id="audio-${it}"></audio>
          </div>
          <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="${answer.src}" id="answer-${it}">
            <label class="game__check${(this.trueAnswers.includes(answer.src) && DEBUG ? ` game__check--true` : ``)}" for="answer-${it}">Отметить</label>
          </div>
        </div>`.trim()).join(``)}
        <button class="game__submit button" type="submit" disabled>Ответить</button>
      </form>
      `;
  }

  getUserSelect() {
    return new Promise((resolve, reject) => {
      const submitButton = this.element.querySelector(`.game__submit`);

      const checkboxes = this.element.querySelectorAll(`.game__input`);
      checkboxes.forEach((el) => {
        el.addEventListener(`click`, activateSubmitButton);
        el.parameters = {submitButton};
      });

      const trackButtons = this.element.querySelectorAll(`.track__button`);
      trackButtons.forEach((el) => {
        el.addEventListener(`click`, playStopAudio);
        el.parameters = {context: this};
      });

      submitButton.addEventListener(`click`, handleSubmitButtonClick);
      submitButton.parameters = {context: this, checkboxes, resolve, reject};
    });
  }
}

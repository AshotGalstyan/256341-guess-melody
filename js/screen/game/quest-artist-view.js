import AbstractView from '../../common/abstract-view.js';
import {DEBUG} from '../../common/constants.js';

const playStopAudio = (evt) => {

  const context = evt.target.parameters.context.element;
  const button = evt.target;
  const audio = context.querySelector(`#audio`);

  if (button.classList.contains(`track__button--play`)) {
    button.classList.replace(`track__button--play`, `track__button--pause`);
    audio.play();
  } else {
    button.classList.replace(`track__button--pause`, `track__button--play`);
    audio.pause();
  }
};

const evaluateСhoice = (evt) => {

  const context = evt.target.parameters.context;

  const thumbnails = context.element.querySelectorAll(`.artist__picture`);
  thumbnails.forEach((el) => {
    el.removeEventListener(`click`, evaluateСhoice);
  });

  const selectedThumbnail = context.element.querySelector(`#${evt.target.id.replace(`img-`, `answer-`)}`).value;
  const trueAnswers = context.trueAnswers;

  if (trueAnswers.includes(selectedThumbnail)) {
    evt.target.parameters.resolve();
  } else {
    evt.target.parameters.reject();
  }
};

export default class ArtistView extends AbstractView {

  constructor(nom, question, src, answers, trueAnswers, mediaFiles) {

    super();

    this.nom = nom;
    this.question = question;
    this.src = src;
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

      <div class="game__track">
        <button class="track__button track__button--play" type="button"></button>
        <audio src="${this.src}" id="audio"></audio>
      </div>

      <form class="game__artist">
        ${this.answers.map((answer, it) => `
          <div class="artist">
            <input class="artist__input visually-hidden" type="radio" name="answer" value="${answer.image.url}" id="answer-${it}">
            <label class="artist__name" for="answer-${it}">
              <img class="artist__picture${(this.trueAnswers.includes(answer.image.url) && DEBUG ? ` artist__picture--true` : ``)}" src="${answer.image.url}" alt="${answer.title}" width="134" height="134" id="img-${it}">
              ${answer.title}
            </label>
          </div>`.trim()).join(``)}
      </form>
      `;
  }

  getUserSelect() {
    return new Promise((resolve, reject) => {
      const thumbnails = this.element.querySelectorAll(`.artist__picture`);
      thumbnails.forEach((el) => {
        el.addEventListener(`click`, evaluateСhoice);
        el.parameters = {context: this, resolve, reject};
      });

      const trackButton = this.element.querySelector(`.track__button`);
      trackButton.addEventListener(`click`, playStopAudio);
      trackButton.parameters = {context: this};
    });
  }
}

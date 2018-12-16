import AbstractView from '../../common/abstract-view.js';

export default class ArtistView extends AbstractView {

  constructor(nom, question, genre, answers) {

    super();

    this.nom = nom;
    this.question = question;
    this.genre = genre;
    this.answers = answers;
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
      <button class="xxx__btn--true">True</button>
      <button class="xxx__btn--false">False</button>
      `;
  }

  getUserSelect() {
    return new Promise((resolve, reject) => {
      const trueButton = this.element.querySelector(`.xxx__btn--true`);
      const falseButton = this.element.querySelector(`.xxx__btn--false`);

      trueButton.addEventListener(`click`, function handleTrueButtonClick() {
        trueButton.removeEventListener(`click`, handleTrueButtonClick);
        resolve();
      });

      falseButton.addEventListener(`click`, function handleFalseButtonClick() {
        falseButton.removeEventListener(`click`, handleFalseButtonClick);
        reject();
      });
    });
  }
}

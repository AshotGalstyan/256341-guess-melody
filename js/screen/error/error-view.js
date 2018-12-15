import AbstractView from '../../common/abstract-view.js';

export default class ErrorView extends AbstractView {

  constructor(text) {

    super();

    this.text = text;
  }

  get wrapperTag() {
    return `section`;
  }
  get wrapperAttributes() {
    return {class: `modal`};
  }

  get template() {
    return `
      <h2 class="modal__title">Произошла ошибка!</h2>
      <p class="modal__text">${this.text}<br>Пожалуйста, перезагрузите страницу.</p>
      `;
  }
}

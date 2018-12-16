import AbstractView from '../../common/abstract-view.js';

export default class ModalView extends AbstractView {
  get wrapperTag() {
    return `section`;
  }
  get wrapperAttributes() {
    return {class: `modal`};
  }
  get template() {
    return `
      <button class="modal__close" type="button"><span class="visually-hidden">Закрыть</span></button>
      <h2 class="modal__title">Подтверждение</h2>
      <p class="modal__text">Вы уверены что хотите начать игру заново?</p>
      <div class="modal__buttons">
        <button class="modal__button button modal__btn--yes">Ок</button>
        <button class="modal__button button modal__btn--no">Отмена</button>
      </div>
    `;
  }

  getUserAction() {
    return new Promise((resolve, reject) => {
      const yesButton = this.element.querySelector(`.modal__btn--yes`);
      const noButton = this.element.querySelector(`.modal__btn--no`);
      const closeButton = this.element.querySelector(`.modal__close`);

      noButton.addEventListener(`click`, function handleNoButtonClick() {
        noButton.removeEventListener(`click`, handleNoButtonClick);
        reject();
      });

      closeButton.addEventListener(`click`, function handleCloseButtonClick() {
        closeButton.removeEventListener(`click`, handleCloseButtonClick);
        reject();
      });

      yesButton.addEventListener(`click`, function handleYesButtonClick() {
        yesButton.removeEventListener(`click`, handleYesButtonClick);
        resolve();
      });
    });
  }
}

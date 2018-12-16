import Timer from '../../common/timer.js';
import {render} from "../../common/utilites.js";
import ModalView from './modal-view.js';
import HeaderView from './header-view.js';
import GenreView from './quest-genre-view.js';
import ArtistView from './quest-artist-view.js';

import {MAX_TIME_LIMIT, QuestionType} from '../../common/constants.js';

export default class GameScreen {

  constructor(router, model) {

    this.router = router;
    this.model = model;
    this.timer = new Timer(MAX_TIME_LIMIT);

    this.updateHeader();
    this.updateQuest();

    this.start();
  }

  get element() {
    return this.root;
  }

  start() {
    this.intervalId = this.getTimerId();
  }

  updateHeader() {

    const timer = this.timer.getTime();
    const header = new HeaderView(timer, this.model.wrongCount);

    header.getUserAction()
      .then(() => {
        this.freezeTimer();
        this.showModal();
      });

    if (this.root) {
      this.root.replaceChild(header.element, this.header);
    }

    this.header = header.element;

  }

  updateQuest() {

    this.model.stepBeginTime = this.timer.getTime();

    const currentStep = this.model.screenplay[this.model.currentStep];

    const quest = (currentStep.type === QuestionType.GENRE ?
      new GenreView(this.model.currentStep, currentStep.question, currentStep.genre, currentStep.answers) :
      new ArtistView(this.model.currentStep, currentStep.question, currentStep.src, currentStep.answers)
    );

    quest.getUserSelect()
      .then(() => this.finishStep(this.model.stepBeginTime - this.timer.getTime()))
      .catch(() => this.finishStep(-1));

    const rootClass = (currentStep.type === QuestionType.GENRE ? `game--genre` : `game--artist`);
    const rootOtherClass = (currentStep.type === QuestionType.GENRE ? `game--artist` : `game--genre`);

    if (this.root) {
      this.root.classList.replace(rootOtherClass, rootClass);
      this.root.replaceChild(quest.element, this.quest);
    } else {
      this.root = render([this.header, quest.element], `section`, {class: `game ` + rootClass});
    }
    this.quest = quest.element;
  }

  getTimerId() {
    return setInterval(() => {
      const time = this.timer.tick();
      this.updateHeader();
      if (time === `finished`) {
        this.finishGame();
      }
    }, 1000);
  }

  freezeTimer() {
    this.freezedTime = this.timer.getTime();
    clearInterval(this.intervalId);
  }

  unfreezeTimer() {
    this.timer.setTime(this.freezedTime);
    this.intervalId = this.getTimerId();
  }

  finishStep(result) {

    this.model.addAnswer(result);

    if (this.model.canContinue) {
      this.updateQuest();
    } else {
      this.finishGame();
    }
  }

  finishGame() {

    const totalTime = MAX_TIME_LIMIT - this.timer.getTime();

    clearInterval(this.intervalId);
    this.root.parentNode.removeChild(this.root);

    this.router.saveCurrentGameResults(this.model.answers, totalTime);
  }

  showModal() {
    const modal = new ModalView();
    this.root.insertBefore(modal.element, this.root.firstChild);
    modal.getUserAction()
      .then(() => {
        this.router.showWelcome();
      })
      .catch(() => {
        this.unfreezeTimer();
        this.root.removeChild(modal.element);
      });
  }
}

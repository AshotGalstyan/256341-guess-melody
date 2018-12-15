import Timer from '../../common/timer.js';
import {render} from "../../common/utilites.js";
import ModalView from './modal-view.js';
import HeaderView from './header-view.js';
import GenreView from './quest-genre-view.js';
import ArtistView from './quest-artist-view.js';

import {
  MAX_TIME_LIMIT, FAST_ANSWER_LIMIT, CRITICAL_TIME,
  QuestionType
} from '../../common/constants.js';

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

  updateHeader() {

    const timer = this.timer.getTime();
    const header = new HeaderView(timer, this.model.getCurrentLives());

    header.onClick = () => {
      this.freezeTimer();
      this.showModal();
    };

    if (this.header) {
      this.header.replaceChild(header.element, this.header);
    }
    this.header = header.element;
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
    this._freezedTime = this.timer.getTime();
    clearInterval(this.intervalId);
  }

  unfreezeTimer() {
    this.timer.setTime(this._freezedTime);
    this.intervalId = this.getTimerId();
  }

  start() {
    this.intervalId = this.getTimerId();
    this.root = render([this.header, this.quest]);
  }


  updateQuest() {

    const currentStep = this.model.screenplay[this.model.getCurrentStep()];

    const quest = (currentStep.type === QuestionType.GENRE ?
      new GenreView(currentStep.question, currentStep.genre, currentStep.answers) :
      new ArtistView(currentStep.question, currentStep.src, currentStep.answers)
    );

    this.questObject = quest;
    quest.getUserSelect = (answer) => {
      this.finishStep(answer, this.timer.getTime() - this.beginStep);
    };

    if (this.root) {
      this.root.replaceChild(quest.element, this.quest);
    } else {
      this.root = render([this.header, quest.element]);
    }
    this.quest = quest.element;

    this.beginStep = this.timer.getTime();
  }

  finishStep(result) {

    this.model.addAnswer(result);

    if (this.model.canContinue()) {
      this.updateTimer();
      this.updateQuest();
    } else {
      this.finishGame();
    }
  }

  finishGame() {
    this.router.saveCurrentGameResults();
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

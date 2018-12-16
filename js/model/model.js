import {MAX_WRONG, TOTAL_STEPS} from "../common/constants.js";

export default class GameModel {

  constructor() {
    this._step = 0;
    this._stepBeginTime = 0;
    this._wrongCount = 0;
    this._answers = [];
    this._gameOver = false;
  }

  get wrongCount() {
    return this._wrongCount;
  }

  get currentStep() {
    return this._step;
  }

  get canContinue() {
    return !this._gameOver;
  }

  get answers() {
    return this._answers;
  }

  get stepBeginTime() {
    return this._stepBeginTime;
  }

  set stepBeginTime(time) {
    this._stepBeginTime = time;
  }

  addAnswer(answer) {

    if (answer === -1) {
      this._wrongCount += 1;
      this._gameOver = (this._wrongCount > MAX_WRONG ? true : false);
    }

    if (!this._gameOver) {
      this._answers.push(answer);
      this._goToNextStep();
    }
  }

  _goToNextStep() {
    if (!this._gameOver) {
      if (this._step < TOTAL_STEPS - 1) {
        this._step += 1;
      } else {
        this._step = -1;
        this._gameOver = true;
      }
    }
  }
}

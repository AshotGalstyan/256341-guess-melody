// import {MAX_LIVES, TOTAL_STEPS, QUIZ_RESULTS} from "../common/constants.js";

export default class GameModel {

  constructor(playerName) {
    this.step = 0;
    this.lives = MAX_LIVES;
    this.answers = [];
    this.gameOver = false;
    this._points = 0;
  }

  /*
  getCurrentStep() {
    return this.step;
  }

  getCurrentLives() {
    return this.lives;
  }

  getAnswers() {
    return this.answers;
  }

  goToNextStep() {
    if (this.step < TOTAL_STEPS - 1) {
      this.step += 1;
    } else {
      this.step = -1;
      this.gameOver = true;
    }
  }

  die() {
    if (this.lives > 0) {
      this.lives -= 1;
    } else {
      this.lives = -1;
      this.gameOver = true;
    }
  }

  addAnswer(answer) {
    this.answers.push(answer);

    const totalWrongs = this.answers.filter((el) => el === QUIZ_RESULTS.wrong.type || el === QUIZ_RESULTS.dead.type);
    if (totalWrongs.length > MAX_LIVES) {
      this.gameOver = true;
    } else {
      this.goToNextStep();
    }
  }
  */

  canContinue() {
    return !this.gameOver;
  }
}

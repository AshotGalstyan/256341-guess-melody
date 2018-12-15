import {MAX_LIVES, TOTAL_STEPS, QUIZ_RESULTS} from "../common/constants.js";

export default class GameModel {

  constructor(playerName) {
    this.step = 0;
    this.stepBeginTime = 0;
    this.lives = MAX_LIVES;
    this.answers = [];
    this.gameOver = false;
  }

  getCurrentLives() {
    return this.lives;
  }

  getCurrentStep() {
    return this.step;
  }

  canContinue() {
    return !this.gameOver;
  }

  addAnswer(answer) {
    this.answers.push(answer);

    const totalWrongs = this.answers.filter((el) => el === QUIZ_RESULTS.wrong.type);
    if (totalWrongs.length > MAX_LIVES) {
      this.gameOver = true;
    } else {
      this.goToNextStep();
    }
  }

  goToNextStep() {
    if (this.step < TOTAL_STEPS - 1) {
      this.step += 1;
    } else {
      this.step = -1;
      this.gameOver = true;
    }
  }

  /*




  getAnswers() {
    return this.answers;
  }



  die() {
    if (this.lives > 0) {
      this.lives -= 1;
    } else {
      this.lives = -1;
      this.gameOver = true;
    }
  }
  */
}

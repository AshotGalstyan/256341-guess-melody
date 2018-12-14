// import GameModel from '../model/model.js';
import Loader from './loader.js';

const mainElement = document.querySelector(`.main`);

const changeScreen = (wrapper, element) => {
  wrapper.innerHTML = ``;
  // wrapper.appendChild(element);
  wrapper.innerHTML = element;
};

export default class Application {

  static start() {
    /*
    const intro = new IntroScreen();
    const greeting = new GreetingScreen(this);
    changeScreen(mainElement, intro.element, greeting.element);
    */

    changeScreen(mainElement, `Begin Loading`);
    Loader.loadData()
      .then((data) => {
        this.screenplay = data.screenplay;
        this.mediaFiles = data.mediaFiles;
      })
      .then(() => Application.playGame())
      .catch((err) => Application.showError(err));
  }

  static playGame() {

    const audios = Object.keys(this.mediaFiles);

    var audio = new Audio(audios[0]);
    audio.play();


    changeScreen(mainElement, `End Loading. screenplay length: ` + this.screenplay.length);
  }
  /*
  static showGreeting() {
    const greeting = new GreetingScreen(this);
    greeting.fadeIn();
    changeScreen(mainElement, greeting.element);
  }

  static showRules() {
    const rules = rulesScreen(this);
    changeScreen(mainElement, rules);
  }

  static showGame(playerName) {
    const model = new GameModel(playerName);
    model.screenplay = this.gameData.screenplay;
    model.gameImages = this.gameData.images;

    const game = new GameScreen(this, model);
    changeScreen(mainElement, game.element);
  }

  static saveCurrentGameResults(answers, lives, playerName) {
    Loader.saveResults({answers, lives}, playerName)
      .then(() => Loader.loadResults(playerName))
      .then((data) => Application.showStat(data, playerName))
      .catch((err) => Application.showError(err));
  }

  static showStat(date) {
    const stat = statScreen(this, date);
    changeScreen(mainElement, stat);
  }
  */
  static showError(err) {
    changeScreen(mainElement, `showError: ` + err);
  }

}

import GameModel from '../model/model.js';
import WelcomeScreen from '../screen/welcome/welcome.js';
import GameScreen from '../screen/game/game.js'
import errorScreen from '../screen/error/error.js';;
import Loader from './loader.js';

const mainElement = document.querySelector(`.main`);

const changeScreen = (wrapper, element) => {
  wrapper.innerHTML = ``;
  wrapper.appendChild(element);
};

export default class Application {

  static start() {
    const welcome = new WelcomeScreen(this, true);
    changeScreen(mainElement, welcome.element);

    Loader.loadData()
      .then((data) => {
        this.screenplay = data.screenplay;
        this.mediaFiles = data.mediaFiles;
      })
      .then(() => Application.hidePreloader(welcome))
      .catch((err) => Application.showError(err));
  }

  static hidePreloader(welcome) {
    welcome.hidePreloader();
  }

  static showWelcome() {
    const welcome = new WelcomeScreen(this, false);
    changeScreen(mainElement, welcome.element);
  }

  static showGame() {
    const model = new GameModel();
    model.screenplay = this.screenplay;
    model.mediaFiles = this.mediaFiles;

    const game = new GameScreen(this, model);
    changeScreen(mainElement, game.element);
  }

  static saveCurrentGameResults(answers, lives) {
    /*
    Loader.saveResults({answers, lives}, playerName)
      .then(() => Loader.loadResults(playerName))
      .then((data) => Application.showStat(data, playerName))
      .catch((err) => Application.showError(err));
    */
  }
  /*

  JSON.stringify(currentScore)

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



  static showStat(date) {
    const stat = statScreen(this, date);
    changeScreen(mainElement, stat);
  }
  */
  static showError(err) {
    const errorModal = errorScreen(err);
    changeScreen(mainElement, errorModal);
  }
}

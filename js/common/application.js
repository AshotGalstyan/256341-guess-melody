import GameModel from '../model/model.js';
import WelcomeScreen from '../screen/welcome/welcome.js';
import GameScreen from '../screen/game/game.js';
import ResultsScreen from '../screen/results/results.js';
import errorScreen from '../screen/error/error.js';
import Loader from './loader.js';

const mainElement = document.querySelector(`.main`);

const changeScreen = (wrapper, element) => {
  wrapper.innerHTML = ``;
  wrapper.appendChild(element);
};

export default class Application {

  static start() {
    const screen = new WelcomeScreen(this, true);
    changeScreen(mainElement, screen.element);

    Loader.loadData()
      .then((data) => {
        this.screenplay = data.screenplay;
        this.mediaFiles = data.mediaFiles;
      })
      .then(() => Application.hidePreloader(screen))
      .catch((err) => Application.showError(err));
  }

  static hidePreloader(screen) {
    screen.hidePreloader();
  }

  static showWelcome() {
    const screen = new WelcomeScreen(this);
    changeScreen(mainElement, screen.element);
  }

  static showGame() {
    const model = new GameModel();
    model.screenplay = this.screenplay;
    model.mediaFiles = this.mediaFiles;

    const screen = new GameScreen(this, model);
    changeScreen(mainElement, screen.element);
  }

  static saveCurrentGameResults(answers, time) {
    Loader.saveResults({time, answers})
      .then(() => Loader.loadResults())
      .then((data) => Application.showResults(data))
      .catch((err) => Application.showError(err));
  }

  static showResults(data) {
    const screen = new ResultsScreen(this, data);
    changeScreen(mainElement, screen.element);
  }

  static showError(err) {
    const errorModal = errorScreen(err);
    changeScreen(mainElement, errorModal);
  }
}

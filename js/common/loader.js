import {
  SERVER_URL, APP_ID,
  QuestionType, MediaFileType, Genre,
  TOTAL_STEPS, UPLOAD_ARTIST_THUMBNAIL, NOIMAGE
} from './constants.js';

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(`Произошла ошибка (код - ${response.status})`);
};

const convertToJSON = (res) => res.json();

const sortResults = (archive) => archive.sort((el1, el2) => el2.date - el1.date);

const convertServerData = (data) => {

  const mediaFiles = {};

  if (!(data instanceof Array)) {
    throw new Error(`Произошла ошибка (код - 01)`);
  }

  if (data.length !== TOTAL_STEPS) {
    throw new Error(`Произошла ошибка (код - 02)`);
  }

  const allowedQuestionTypes = Object.values(QuestionType);
  const allowedGenres = Object.values(Genre);

  for (const step of data) {

    if (!(allowedQuestionTypes.includes(step.type))) {
      throw new Error(`Произошла ошибка (код - 03)`);
    }

    if (step.type === QuestionType.GENRE) {

      if (!(allowedGenres.includes(step.genre))) {
        throw new Error(`Произошла ошибка (код - 04)`);
      }

      for (const answer of step.answers) {
        if (!(allowedGenres.includes(answer.genre))) {
          throw new Error(`Произошла ошибка (код - 04)`);
        }
        mediaFiles[answer.src] = {type: MediaFileType.AUDIO};
      }

      step.trueAnswers = step.answers.filter((el) => el.genre === step.genre).map((el) => el.src);

    } else {

      mediaFiles[step.src] = {type: MediaFileType.AUDIO};

      if (UPLOAD_ARTIST_THUMBNAIL) {
        for (const answer of step.answers) {
          mediaFiles[answer.image.url] = {type: MediaFileType.IMG};
        }
      }

      step.trueAnswers = step.answers.filter((el) => el.isCorrect).map((el) => el.image.url);

    }
  }

  return {screenplay: data, mediaFiles};

};

const loadMediaFile = (url, type) => {
  return new Promise((resolve, reject) => {
    if (type === MediaFileType.IMG) {
      const image = new Image();
      image.addEventListener(`load`, () => resolve(image));
      // For change image to noimage.png, when get 404 (in mediaFiles will get .size = {"width":0,"height":0})
      image.addEventListener(`error`, () => resolve(image));
      image.src = url;
    } else {
      const audio = new Audio();
      audio.addEventListener(`loadeddata`, () => resolve(audio));
      audio.addEventListener(`error`, () => reject(new Error(`Failed to load mediafile from URL: ${url}`)));
      audio.src = url;
    }
  });
};

export default class Loader {
  static loadData() {
    return fetch(`${SERVER_URL}questions`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {

        const temporary = convertServerData(data);

        this.mediaFiles = temporary.mediaFiles;
        this.screenplay = temporary.screenplay;

        return Object.keys(this.mediaFiles);

      })
      .then((mediaFiles) => mediaFiles.map((mediaFile) => loadMediaFile(mediaFile, this.mediaFiles[mediaFile].type)))
      .then((mediaPromises) => Promise.all(mediaPromises))
      .then((mediaFiles) => {

        mediaFiles.forEach((it) => {
          if (this.mediaFiles[it.src].type === MediaFileType.IMG) {
            this.mediaFiles[it.src][`size`] = {width: it.width, height: it.height};
          }
        });
        return {screenplay: this.screenplay, mediaFiles: this.mediaFiles};
      })
      .then(() => {
        for (const step of this.screenplay) {
          if (step.type === `artist`) {
            for (const answer of step.answers) {
              if (this.mediaFiles[answer.image.url].size.width === 0) {
                // Thumbnail with 404 response
                const index = step.trueAnswers.indexOf(answer.image.url);
                if (index > -1) {
                  step.trueAnswers[index] = NOIMAGE.src;
                }
                answer.image.url = NOIMAGE.src;
              }
            }
          }
        }
        return {screenplay: this.screenplay, mediaFiles: this.mediaFiles};
      });
  }

  static loadResults() {
    return fetch(`${SERVER_URL}/stats/${APP_ID}`).then(checkStatus).then(convertToJSON).then(sortResults);
  }

  static saveResults(data) {
    const requestSettings = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };
    return fetch(`${SERVER_URL}/stats/${APP_ID}`, requestSettings).then(checkStatus);
  }
}

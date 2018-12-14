import {
  SERVER_URL, DEFAULT_NAME, APP_ID,
  QuestionType, MediaFileType, Genre,
  TOTAL_STEPS, UPLOAD_ARTIST_THUMBNAIL
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
        mediaFiles[answer.src] = MediaFileType.AUDIO;
      }
    } else {

      mediaFiles[step.src] = MediaFileType.AUDIO;

      if (UPLOAD_ARTIST_THUMBNAIL) {
        for (const answer of step.answers) {
          mediaFiles[answer.image.url] = MediaFileType.IMG;
        }
      }
    }
  }

  return {screenplay: data, mediaFiles};

};

const loadMediaFile = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener(`load`, () => resolve(image));
    image.addEventListener(`error`, () => reject(new Error(`Failed to load mediafile from URL: ${url}`)));
    image.src = url;
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
      .then((mediaFiles) => mediaFiles.map((mediaFile) => loadMediaFile(mediaFile)))
      .then((mediaPromises) => Promise.all(mediaPromises))
      .then(() => ({screenplay: this.screenplay, mediaFiles: this.mediaFiles}));
  }

  static loadResults(name = DEFAULT_NAME) {
    return fetch(`${SERVER_URL}/stats/${APP_ID}-${name}`).then(checkStatus).then(convertToJSON).then(sortResults);
  }

  static saveResults(data, name = DEFAULT_NAME) {
    data = Object.assign({name}, data);
    const requestSettings = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };
    return fetch(`${SERVER_URL}/stats/${APP_ID}-${name}`, requestSettings).then(checkStatus);
  }
}

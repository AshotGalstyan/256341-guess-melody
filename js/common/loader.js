import {
  SERVER_URL, APP_ID,
  QuestionType, MediaFileType, Genre,
  TOTAL_STEPS, DOWNLOAD_MEDIAFILES, DOWNLOAD_ARTIST_THUMBNAIL, NOIMAGE
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

      if (DOWNLOAD_ARTIST_THUMBNAIL) {
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

    if (DOWNLOAD_MEDIAFILES) {
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
    } else {
      resolve(null);
    }
  });
};

const saveServerData = (data, context) => {

  const temporary = convertServerData(data);

  context.mediaFiles = temporary.mediaFiles;
  context.screenplay = temporary.screenplay;

  return Object.keys(context.mediaFiles);

};

const storeMediaFilesIntoDOMObjects = (mediaFiles, context) => {

  if (DOWNLOAD_MEDIAFILES) {
    mediaFiles.forEach((it) => {
      context.mediaFiles[it.src][`mediafile`] = it;
      if (context.mediaFiles[it.src].type === MediaFileType.IMG) {
        context.mediaFiles[it.src][`size`] = {width: it.width, height: it.height};
      }
    });
  }
  return {screenplay: context.screenplay, mediaFiles: context.mediaFiles};
};

const changeBadImagesWithNOIMAGE = (context) => {

  if (DOWNLOAD_MEDIAFILES) {
    for (const step of context.screenplay) {
      if (step.type === `artist`) {
        for (const answer of step.answers) {
          if (context.mediaFiles[answer.image.url].size.width === 0) {
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
  }

  return {screenplay: context.screenplay, mediaFiles: context.mediaFiles};

};


export default class Loader {
  static loadData() {
    return fetch(`${SERVER_URL}questions`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => saveServerData(data, this))
      .then((mediaFiles) => mediaFiles.map((mediaFile) => loadMediaFile(mediaFile, this.mediaFiles[mediaFile].type)))
      .then((mediaPromises) => Promise.all(mediaPromises))
      .then((mediaFiles) => storeMediaFilesIntoDOMObjects(mediaFiles, this))
      .then(() => changeBadImagesWithNOIMAGE(this));
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

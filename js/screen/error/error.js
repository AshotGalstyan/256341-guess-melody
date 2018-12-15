import ErrorView from './error-view.js';

export default (text) => {

  const error = new ErrorView(text);

  return error.element;
};

import {render} from './utilites.js';

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can't instantiate AbstractView, only concrete one`);
    }
  }
  get wrapperTag() {
    // div is default tag
  }
  get wrapperAttributes() {
    return {}; // without attributes
  }

  get template() {
    throw new Error(`Template is required`);
  }

  get element() {
    if (this._element) {
      return this._element;
    }
    this._element = this.render();
    this.bind(this._element);
    return this._element;
  }

  render() {
    return render(this.template, this.wrapperTag, this.wrapperAttributes);
  }

  bind() {
    // bind handlers if required
  }

  unbind() {
    // bind handlers if required
  }
}

export default AbstractView;

export const compareRandom = () => 0.5 - Math.random();

export const render = (inner, wrapperTag = `div`, wrapperAttributes = {}) => {
  const wrapper = document.createElement(wrapperTag);
  for (const key in wrapperAttributes) {
    if (wrapperAttributes.hasOwnProperty(key)) {
      wrapper.setAttribute(key, wrapperAttributes[key]);
    }
  }
  if (inner instanceof Array) {
    const fragment = document.createDocumentFragment();
    inner.forEach((element) => fragment.appendChild(element));
    wrapper.appendChild(fragment);
  } else {
    wrapper.innerHTML = inner.trim();
  }
  return wrapper;
};

class Timer {
  constructor(time) {
    this._time = time;
  }

  tick() {
    if (!this._time) {
      return `finished`;
    }

    this._time--;

    return this._time || `finished`;
  }

  getTime() {
    return this._time;
  }

  setTime(time) {
    this._time = time;
  }
}

export default Timer;

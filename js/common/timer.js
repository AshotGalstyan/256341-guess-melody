class Timer {
  constructor(time) {
    this.time = time;
    this._startTime = time;
  }

  tick() {
    if (!this.time) {
      return `finished`;
    }

    this.time--;

    return this.time || `finished`;
  }

  reset() {
    this.time = this._startTime;
  }

  getTime() {
    return this.time;
  }

  setTime(time) {
    this.time = time;
  }
}

export default Timer;

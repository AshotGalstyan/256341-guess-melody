import assert from 'assert';
import {getRadius, getScore, groupAnswers, timeToText, scoreToText, fastCountToText, wrongCountToText, compareScores} from './utilites.js';

describe(`Game functions`, () => {
  describe(`getScore`, () => {
    it(`Valid`, () => {
      assert.equal(getScore([31, 31, 31, 31, 31, 31, 31, 31, 31, 31]), 10);
      assert.equal(getScore([21, 21, 31, 31, 31, 31, 31, 31, 31, 31]), 12);
      assert.equal(getScore([31, 31, 31, 31, 31, -1, -1, 31, 31, 31]), 4);
      assert.equal(getScore([31, 31, 31, 31, 31, -1, -1, -1, 31, 31]), 1);
      assert.equal(getScore([21, 21, 31, 31, -1, 31, 31, 31, 31, -1]), 6);
    });
    it(`Invalid`, () => {
      assert.equal(getScore([]), -1);
      assert.equal(getScore([31, 31, 31, 31, 31, 31, 31, 31, 31]), -1);
      assert.equal(getScore([31]), -1);
      assert.equal(getScore([31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]), -1);
    });
    it(`Incorrect`, () => {
      assert.equal(getScore({}), -1);
      assert.equal(getScore(`1234567890`), -1);
      assert.equal(getScore(123), -1);
    });
  });

  describe(`groupAnswers`, () => {
    it(`Valid`, () => {
      assert.deepEqual(groupAnswers([31, 31, 31, 31, 31, 31, 31, 31, 31, 31]), {fast: 0, wrong: 0});
      assert.deepEqual(groupAnswers([21, 21, 31, 31, 31, 31, 31, 31, 31, 31]), {fast: 2, wrong: 0});
      assert.deepEqual(groupAnswers([31, 31, 31, 31, 31, -1, -1, 31, 31, 31]), {fast: 0, wrong: 2});
      assert.deepEqual(groupAnswers([31, 31, 31, 31, 31, -1, -1, -1, 31, 31]), {fast: 0, wrong: 3});
      assert.deepEqual(groupAnswers([21, 21, 31, 31, -1, 31, 31, 31, 31, -1]), {fast: 2, wrong: 2});
    });
  });

  describe(`...ToText`, () => {
    it(`timeToText`, () => {
      assert.equal(timeToText(1), `1 секунду`);
      assert.equal(timeToText(2), `2 секунды`);
      assert.equal(timeToText(3), `3 секунды`);
      assert.equal(timeToText(4), `4 секунды`);
      assert.equal(timeToText(5), `5 секунд`);
      assert.equal(timeToText(59), `59 секунд`);

      assert.equal(timeToText(60), `1 минуту`);
      assert.equal(timeToText(120), `2 минуты`);
      assert.equal(timeToText(180), `3 минуты`);
      assert.equal(timeToText(240), `4 минуты`);
      assert.equal(timeToText(300), `5 минут`);

      assert.equal(timeToText(61), `1 минуту и 1 секунду`);
      assert.equal(timeToText(62), `1 минуту и 2 секунды`);
      assert.equal(timeToText(179), `2 минуты и 59 секунд`);
    });

    it(`scoreToText`, () => {
      assert.equal(scoreToText(0), `0 баллов`);
      assert.equal(scoreToText(1), `1 балл`);
      assert.equal(scoreToText(2), `2 балла`);
      assert.equal(scoreToText(3), `3 балла`);
      assert.equal(scoreToText(4), `4 балла`);
      assert.equal(scoreToText(5), `5 баллов`);
      assert.equal(scoreToText(20), `20 баллов`);
    });

    it(`fastCountToText`, () => {
      assert.equal(fastCountToText(0), `0 быстрых`);
      assert.equal(fastCountToText(1), `1 быстрый`);
      assert.equal(fastCountToText(2), `2 быстрых`);
      assert.equal(fastCountToText(3), `3 быстрых`);
      assert.equal(fastCountToText(4), `4 быстрых`);
      assert.equal(fastCountToText(5), `5 быстрых`);
      assert.equal(fastCountToText(10), `10 быстрых`);
    });

    it(`wrongCountToText`, () => {
      assert.equal(wrongCountToText(0), `0 ошибок`);
      assert.equal(wrongCountToText(1), `1 ошибку`);
      assert.equal(wrongCountToText(2), `2 ошибки`);
      assert.equal(wrongCountToText(3), `3 ошибки`);
    });
  });
  describe(`compareScores`, () => {
    it(`Valid`, () => {
      assert.equal(compareScores(10, [11, 8, 5, 4]), `Вы заняли 2 место из 5 игроков. Это лучше, чем у 60% игроков.`);
      assert.equal(compareScores(12, [11, 8, 5, 4]), `Вы заняли 1 место из 5 игроков. Это лучше, чем у 80% игроков.`);
      assert.equal(compareScores(2, [11, 8, 5, 4]), `Вы заняли последнее место из 5 игроков. Это худший результат.`);
    });
  });
});

describe(`Function should correctly calculate circle length`, () => {
  describe(`Normal cases`, () => {
    it(`Should return full length and 0 in initial state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      assert.equal(getRadius(1, 100).stroke, 628);
      assert.equal(getRadius(1, 100).offset, 0);
    });

    it(`Should return 0 and full length in the final state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      assert.equal(getRadius(0, 100).stroke, 628);
      assert.equal(getRadius(0, 100).offset, 628);
    });

    it(`Offset and length should be equal on a half`, () => {
      // 2 * 3.14 * 100 / 2 = 3.14 * 100 = 314
      assert.equal(getRadius(0.5, 100).stroke, 628);
      assert.equal(getRadius(0.5, 100).offset, 314);
    });
  });
});

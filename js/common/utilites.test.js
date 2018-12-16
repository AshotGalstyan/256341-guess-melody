import assert from 'assert';

import {getScore, groupAnswers} from './utilites.js';

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
});

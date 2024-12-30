import assert = require('assert');
import sum from '../src/core/sum';
import { describe, it } from 'node:test';

describe('#sum()', () => {
  it('should sum up numbers of array', () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.deepStrictEqual(sum(array), 55);
  });
});

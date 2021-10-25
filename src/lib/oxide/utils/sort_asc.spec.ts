import { sort_asc } from './sort_asc';

describe('lib/sort_asc', () => {
  test.each([
    [0, 0, 0],
    [0, 1, -1],
    [1, 0, 1],
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
  ])('%#: sort_asc(%d, %d) -> %d', (a, b, expected) =>
    expect(sort_asc(a, b)).toBe(expected)
  );
});

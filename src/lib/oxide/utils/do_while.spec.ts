/**
 * Tests for do_while.ts
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { do_while } from './do_while';

describe('do_while', () => {
  test('do_while<T>(predicate, fn, init) -> T', () => {
    // Given
    const predicate = (xa: number[]) => xa.length < 10;
    const fn = (xa: number[], i: number) => {
      xa.push(i);
      return xa;
    };
    const init: number[] = [];

    expect(do_while(predicate, fn, init)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});

/**
 * Tests for fp_lists.ts
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { Option, Some, None } from '../option';
import {
  init,
  safe_init,
  head,
  safe_head,
  tail,
  safe_tail,
  last,
  safe_last,
  safe_find,
} from './fp_list';

describe('fp_list', () => {
  describe('head', () => {
    test.each([
      [[1, 2, 3], 1],
      [[2, 3, 4], 2],
      [[], undefined],
    ])('head(%p)', (xa: number[], expected: number | undefined) =>
      expect(head(xa)).toBe(expected)
    );
  });

  describe('safe_head', () => {
    test.each([
      [[1, 2, 3], Some(1)],
      [[2, 3, 4], Some(2)],
      [[], None<number>()],
    ])('safe_head(%p)', (xa: number[], expected: Option<number>) =>
      expect(safe_head(xa)).toStrictEqual(expected)
    );
  });

  describe('tail', () => {
    test.each([
      [
        [1, 2, 3],
        [2, 3],
      ],
      [
        [2, 3, 4],
        [3, 4],
      ],
      [[], []],
      [[1], []],
    ])('tail(%p)', (xa: number[], expected: number[]) =>
      expect(tail(xa)).toStrictEqual(expected)
    );
  });

  describe('safe_tail', () => {
    test.each([
      [[1, 2, 3], Some([2, 3])],
      [[2, 3, 4], Some([3, 4])],
      [[], None<number[]>()],
      [[1], None<number[]>()],
    ])('safe_tail(%p)', (xa: number[], expected: Option<number[]>) =>
      expect(safe_tail(xa)).toStrictEqual(expected)
    );
  });

  describe('init', () => {
    test.each([
      [
        [1, 2, 3],
        [1, 2],
      ],
      [
        [2, 3, 4],
        [2, 3],
      ],
      [[2, 3], [2]],
      [[2], []],
    ])('init(%p)', (xa: number[], expected: number[]) =>
      expect(init(xa)).toStrictEqual(expected)
    );
  });
  describe('safe_init', () => {
    test.each([
      [[1, 2, 3], Some([1, 2])],
      [[2, 3, 4], Some([2, 3])],
      [[2, 3], Some([2])],
      [[2], None<number[]>()],
    ])('safe_init(%p)', (xa: number[], expected: Option<number[]>) =>
      expect(safe_init(xa)).toStrictEqual(expected)
    );
  });

  describe('last', () => {
    test.each([
      [[1, 2, 3], 3],
      [[2, 3, 4], 4],
      [[], undefined],
      [[1], 1],
    ])('last(%p)', (xa: number[], expected?: number) =>
      expect(last(xa)).toStrictEqual(expected)
    );
  });
  describe('safe_last', () => {
    test.each([
      [[1, 2, 3], Some(3)],
      [[2, 3, 4], Some(4)],
      [[1], Some(1)],
      [[], None<number>()],
    ])('safe_last(%p)', (xa: number[], expected: Option<number>) =>
      expect(safe_last(xa)).toStrictEqual(expected)
    );
  });

  describe('safe_find', () => {
    test.each([
      [(v: number) => v === 3, [1, 2, 3], Some(3)],
      [(v: number) => v === 2, [1, 2, 3], Some(2)],
      [(v: number) => v === 3, [1, 2, 5], None<number>()],
    ])(
      '$# safe_find(predicate, <Object>) => Option',
      (
        predicate: (arg0: number) => boolean,
        target: number[],
        expected: Option<number>
      ) => expect(safe_find(predicate, target)).toStrictEqual(expected)
    );
  });
});

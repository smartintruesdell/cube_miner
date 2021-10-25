/**
 * Tests for the Result type
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { Result, Ok, Err } from './result';
import { Some, None } from '../option';

describe('Result', () => {
  describe('constructors', () => {
    test('Ok<T,E>(T) -> Result<T,E>', () => {
      // Given
      const value: number = 5;

      // When
      const res = Ok<number, Error>(value);

      // Then
      expect(res).toBeInstanceOf(Result);
      expect(res.isOk()).toBe(true);
    });
    test('Err<T,E>(E) -> Result<T,E>', () => {
      // Given
      const error = new TypeError('Whoops');

      // When
      const res = Err<number, TypeError>(error);

      // Then
      expect(res).toBeInstanceOf(Result);
      expect(res.isErr()).toBe(true);
    });
  });
  describe('Ok', () => {
    test('isOk() -> true', () => {
      expect(Ok(5).isOk()).toBe(true);
    });
    test('isErr() -> false', () => {
      expect(Ok(5).isErr()).toBe(false);
    });
    test('contains(T)?true -> true', () => {
      expect(Ok(5).contains(5)).toBe(true);
    });
    test('contains(T)?false -> false', () => {
      expect(Ok(5).contains(3)).toBe(false);
    });
    test('containsErr(E) -> false', () => {
      const err = new Error('Whoops');
      expect(Ok(5).containsErr(err)).toBe(false);
    });
    test('ok() -> Some', () => {
      expect(Ok(5).ok()).toStrictEqual(Some(5));
    });
    test('err() -> None', () => {
      expect(Ok(5).err()).toStrictEqual(None<number>());
    });
    test('map(f: (arg0: T) -> U) -> Result<U, E>', () => {
      // Given
      const value = 5;
      const f = (v: number): string => `${v}`;
      // Then
      expect(Ok(value).map(f)).toStrictEqual(Ok(f(value)));
    });
    test('mapOr<U>(fb: U, f: (arg0: T) => U): Result<U, E>', () => {
      // Given
      const value = 5;
      const fallback = '-1';
      const f = (v: number): string => `${v}`;
      // Then
      expect(Ok(value).mapOr(fallback, f)).toStrictEqual(Ok(f(value)));
    });
    test('mapOrElse<U>(fb: (arg0: E) => U, f: (arg0: T) => U): Result<U, E>', () => {
      // Given
      const value = 5;
      const callback = () => '-1';
      const f = (v: number): string => `${v}`;
      // Then
      expect(Ok(value).mapOrElse(callback, f)).toStrictEqual(Ok(f(value)));
    });
    test('mapErr<F extends Error>(f: (arg0: E) => F): Result<T, F>', () => {
      // Given
      const f = (e: Error): Error => new Error('whoops');
      // Then
      expect(Ok<number, Error>(5).mapErr(f)).toStrictEqual(Ok(5));
    });
    test('and(res: Result<T, E>): Result<T, E>', () => {
      expect(Ok(5).and(Ok(3))).toStrictEqual(Ok(3));
    });
    test('andThen<U>(f: (arg0: T) => Result<U, E>): Result<U, E>', () => {
      // Given
      const f = (v: number): Result<string, Error> => Ok(`${v}`);
      // Then
      expect(Ok(5).andThen(f)).toStrictEqual(f(5));
    });
    test('or(res: Result<T, E>): Result<T, E>', () => {
      expect(Ok(5).or(Ok(3))).toStrictEqual(Ok(5));
    });
    test('orElse<F extends Error>(f: (arg0: E) => Result<T, F>): Result<T, F>', () => {
      // Given
      const f = (e: Error): Result<number, Error> => Ok(3);
      // Then
      expect(Ok<number, Error>(5).orElse(f)).toStrictEqual(Ok(5));
    });
    test('unwrap(): T', () => {
      expect(Ok(5).unwrap()).toEqual(5);
    });
    test('unwrapOr(fb: T): T', () => {
      expect(Ok(5).unwrapOr(3)).toEqual(5);
    });
    test('unwrapOrElse(f: (arg0: E) => T): T', () => {
      // Given
      const f = (e: Error): number => 3;
      // Then
      expect(Ok<number, Error>(5).unwrapOrElse(f)).toEqual(5);
    });
    test('expect(arg0: string): T', () => {
      expect(Ok(5).expect('Error')).toEqual(5);
    });
    test('expectErr(arg0: string): E', () => {
      expect(() => Ok<number, Error>(5).expectErr('Error')).toThrow('Error: 5');
    });
    test('match<U>(resolver: ResultMatchResolver<T, U>): U', () => {
      // Given
      const resolver = {
        Ok: jest.fn().mockImplementation((v: number) => v * 2),
        Err: jest.fn().mockImplementation((e: Error) => 0),
      };
      // When
      const result = Ok<number, Error>(5).match(resolver);

      // Then
      expect(result).toEqual(10);
      expect(resolver.Ok).toHaveBeenCalled();
      expect(resolver.Err).not.toHaveBeenCalled();
    });
  });
  describe('Err', () => {
    const testErr = new Error('Whoops');

    test('isOk() -> false', () => {
      expect(Err(testErr).isOk()).toBe(false);
    });
    test('isErr() -> true', () => {
      expect(Err(testErr).isErr()).toBe(true);
    });
    test('contains(T) -> false', () => {
      expect(Err(testErr).contains(5)).toBe(false);
    });
    test('containsErr(E) -> true', () => {
      expect(Err(testErr).containsErr(testErr)).toBe(true);
    });
    test('ok() -> None', () => {
      expect(Err(testErr).ok()).toStrictEqual(None());
    });
    test('err() -> Some(E)', () => {
      expect(Err(testErr).err()).toStrictEqual(Some(testErr));
    });
    test('map(f: (arg0: T) -> U) -> Result<U, E>', () => {
      // Given
      const f = (v: number): string => `${v}`;
      // Then
      expect(Err<number, Error>(testErr).map(f)).toStrictEqual(
        Err<string, Error>(testErr)
      );
    });
    test('mapOr<U>(fb: U, f: (arg0: T) => U): Result<U, E>', () => {
      // Given
      const value = 5;
      const fallback = '-1';
      const f = (v: number): string => `${v}`;
      // Then
      expect(Err<number, Error>(testErr).mapOr(fallback, f)).toStrictEqual(
        Ok(fallback)
      );
    });
    test('mapOrElse<U>(fb: (arg0: E) => U, f: (arg0: T) => U): Result<U, E>', () => {
      // Given
      const value = 5;
      const callback = (e: Error) => '-1';
      const f = (v: number): string => `${v}`;
      // Then
      expect(Err<number, Error>(testErr).mapOrElse(callback, f)).toStrictEqual(
        Ok(callback(testErr))
      );
    });
    test('mapErr<F extends Error>(f: (arg0: E) => F): Result<T, F>', () => {
      // Given
      const new_err = new Error('Bonk');
      const f = (e: Error): Error => new_err;

      // Then
      expect(Err(testErr).mapErr(f)).toStrictEqual(Err(new_err));
    });
    test('and(res: Result<T, E>): Result<T, E>', () => {
      expect(Err(testErr).and(Ok(3))).toStrictEqual(Err(testErr));
    });
    test('andThen<U>(f: (arg0: T) => Result<U, E>): Result<U, E>', () => {
      // Given
      const f = (v: number): Result<string, Error> => Ok(`${v}`);
      // Then
      expect(Err<number, Error>(testErr).andThen(f)).toStrictEqual(
        Err(testErr)
      );
    });
    test('or(res: Result<T, E>): Result<T, E>', () => {
      expect(Err(testErr).or(Ok(3))).toStrictEqual(Ok(3));
    });
    test('orElse<F extends Error>(f: (arg0: E) => Result<T, F>): Result<T, F>', () => {
      // Given
      const f = (e: Error): Result<number, Error> => Ok(3);
      // Then
      expect(Err(testErr).orElse(f)).toStrictEqual(Ok(3));
    });
    test('unwrap(): T', () => {
      expect(() => Err(testErr).unwrap()).toThrow();
    });
    test('unwrapOr(fb: T): T', () => {
      expect(Err(testErr).unwrapOr(3)).toEqual(3);
    });
    test('unwrapOrElse(f: (arg0: E) => T): T', () => {
      // Given
      const f = (e: Error): number => 3;
      // Then
      expect(Err(testErr).unwrapOrElse(f)).toEqual(3);
    });
    test('expect(arg0: string): T', () => {
      expect(() => Err(testErr).expect('Error')).toThrow(
        `Error: ${testErr.message}`
      );
    });
    test('expect(arg0: string): T', () => {
      expect(() => Err('Bonk').expect('Error')).toThrow(`Error: Bonk`);
    });
    test('expectErr(arg0: string): E', () => {
      expect(Err<number, Error>(testErr).expectErr('Bonk')).toEqual(testErr);
    });
    test('match<U>(resolver: ResultMatchResolver<T, U>): U', () => {
      // Given
      const resolver = {
        Ok: jest.fn().mockImplementation((v: number) => v * 2),
        Err: jest.fn().mockImplementation((e: Error) => 0),
      };
      // When
      const result = Err(testErr).match(resolver);

      // Then
      expect(result).toEqual(0);
      expect(resolver.Ok).not.toHaveBeenCalled();
      expect(resolver.Err).toHaveBeenCalled();
    });
  });
});

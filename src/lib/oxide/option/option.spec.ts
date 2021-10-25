/**
 * Tests for the Option type
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { Option, Some, None } from './option';
import { Result, Ok, Err } from '../result';

describe('Option', () => {
  describe('constructors', () => {
    test('Some<T>(value:T) -> Option<T>', () => {
      expect(Some(5)).toBeInstanceOf(Option);
    });
    test('None<T>() -> Option<T>', () => {
      expect(None<number>()).toBeInstanceOf(Option);
    });
  });
  describe('Some', () => {
    test('isSome() -> true', () => {
      expect(Some(5).isSome()).toBe(true);
    });
    test('isNone() -> false', () => {
      expect(Some(5).isNone()).toBe(false);
    });
    test('contains(T?true) -> true', () => {
      expect(Some(5).contains(5)).toBe(true);
    });
    test('contains(T?false) -> false', () => {
      expect(Some(5).contains(0)).toBe(false);
    });
    test('expect(msg) -> T', () => {
      expect(Some(5).expect('Error')).toEqual(5);
    });
    test('unwrap(): T', () => {
      expect(Some(5).unwrap()).toEqual(5);
    });
    test('unwrapOr(fb: T): T', () => {
      expect(Some(5).unwrapOr(3)).toEqual(5);
    });
    test('unwrapOrElse(f: () => T): T', () => {
      // Given
      const f = jest.fn().mockImplementation(() => 3);
      // Then
      expect(Some(5).unwrapOrElse(f)).toEqual(5);
      expect(f).not.toHaveBeenCalled();
    });
    test('map<U>(f: (arg0: T) => U): Option<U>', () => {
      // Given
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(Some(5).map<string>(f)).toStrictEqual(Some('5'));
      expect(f).toHaveBeenCalled();
    });
    test('mapOr<U>(fb: U, f: (arg0: T) => U): Option<U>', () => {
      // Given
      const fallback = '0';
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(Some(5).mapOr<string>(fallback, f)).toStrictEqual(Some('5'));
      expect(f).toHaveBeenCalled();
    });
    test('mapOrElse<U>(d: () => U, f: (arg0: T) => U): Option<U>', () => {
      // Given
      const fallback = jest.fn().mockImplementation((): string => '0');
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(Some(5).mapOrElse<string>(fallback, f)).toStrictEqual(Some('5'));
      expect(f).toHaveBeenCalled();
      expect(fallback).not.toHaveBeenCalled();
    });
    test('okOr<E extends Error>(err: E): Result<T, E>', () => {
      // Given
      const new_err = new Error('Error');
      // Then
      expect(Some(5).okOr<Error>(new_err)).toStrictEqual(Ok<number, Error>(5));
    });
    test('okOrElse<E extends Error>(err: () => E): Result<T, E>', () => {
      // Given
      const new_err = new Error('Error');
      const f = jest.fn().mockImplementation((): Error => new_err);

      // Then
      expect(Some(5).okOrElse<Error>(f)).toStrictEqual(Ok<number, Error>(5));
      expect(f).not.toHaveBeenCalled();
    });
    test('and(opt: Option<T>): Option<T>', () => {
      expect(Some(5).and(Some(3))).toStrictEqual(Some(3));
    });
    test('andThen<U>(f: (arg0: T) => Option<U>): Option<U>', () => {
      // Given
      const f = jest
        .fn()
        .mockImplementation((v: number): Option<number> => Some(v * 2));
      // Then
      expect(Some(5).andThen(f)).toStrictEqual(Some(10));
      expect(f).toHaveBeenCalled();
    });
    test('filter(predicate: (arg0: T) => boolean?true): Some<T>', () => {
      // Given
      const predicate = (v: number) => v >= 10;
      // Then
      expect(Some(10).filter(predicate)).toStrictEqual(Some(10));
    });
    test('filter(predicate: (arg0: T) => boolean?false): None<T>', () => {
      // Given
      const predicate = (v: number) => v >= 10;
      // Then
      expect(Some(5).filter(predicate)).toStrictEqual(None());
    });
    test('or(opt: Option<T>): self', () => {
      expect(Some(5).or(Some(3))).toStrictEqual(Some(5));
    });
    test('orElse(f: () => Option<T>): Option<T>', () => {
      // Given
      const f = jest.fn().mockImplementation((): Option<number> => Some(10));
      // Then
      expect(Some(5).orElse(f)).toStrictEqual(Some(5));
      expect(f).not.toHaveBeenCalled();
    });
    test('xor(opt: Some<T>): None<T>', () => {
      expect(Some(5).xor(Some(3))).toStrictEqual(None());
    });
    test('xor(opt: None<T>): self', () => {
      expect(Some(5).xor(None())).toStrictEqual(Some(5));
    });
    test('zip<U>(right: Some<U>): Some<[T, U]>', () => {
      expect(Some(5).zip(Some('a'))).toStrictEqual(Some([5, 'a']));
    });
    test('zip<U>(right: None<U>): None<[T, U]>', () => {
      expect(Some(5).zip(None())).toStrictEqual(None());
    });
    test('match<U>(resolver: OptionMatchResolver<T, U>): U', () => {
      // Given
      const resolver = {
        Some: jest.fn().mockImplementation((v: number): number => v * 2),
        None: jest.fn().mockImplementation((): number => 0),
      };
      // Then
      expect(Some(5).match(resolver)).toEqual(10);
      expect(resolver.Some).toHaveBeenCalled();
      expect(resolver.None).not.toHaveBeenCalled();
    });
  });
  describe('None', () => {
    test('isSome() -> true', () => {
      expect(None().isSome()).toBe(false);
    });
    test('isNone() -> false', () => {
      expect(None().isNone()).toBe(true);
    });
    test('contains(T?true) -> true', () => {
      expect(None().contains(5)).toBe(false);
    });
    test('expect(msg) -> T', () => {
      expect(() => None().expect('Error')).toThrow('Error');
    });
    test('unwrap(): T', () => {
      expect(() => None().unwrap()).toThrow();
    });
    test('unwrapOr(fb: T): T', () => {
      expect(None().unwrapOr(3)).toEqual(3);
    });
    test('unwrapOrElse(f: () => T): T', () => {
      // Given
      const f = jest.fn().mockImplementation(() => 3);
      // Then
      expect(None().unwrapOrElse(f)).toEqual(3);
      expect(f).toHaveBeenCalled();
    });
    test('map<U>(f: (arg0: T) => U): Option<U>', () => {
      // Given
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(None<number>().map<string>(f)).toStrictEqual(None<string>());
      expect(f).not.toHaveBeenCalled();
    });
    test('mapOr<U>(fb: U, f: (arg0: T) => U): Option<U>', () => {
      // Given
      const fallback = '0';
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(None<number>().mapOr<string>(fallback, f)).toStrictEqual(
        Some(fallback)
      );
      expect(f).not.toHaveBeenCalled();
    });
    test('mapOrElse<U>(d: () => U, f: (arg0: T) => U): Option<U>', () => {
      // Given
      const fallback = jest.fn().mockImplementation((): string => '0');
      const f = jest.fn().mockImplementation((v: number): string => String(v));
      // Then
      expect(None<number>().mapOrElse<string>(fallback, f)).toStrictEqual(
        Some('0')
      );
      expect(f).not.toHaveBeenCalled();
      expect(fallback).toHaveBeenCalled();
    });
    test('okOr<E extends Error>(err: E): Result<T, E>', () => {
      // Given
      const new_err = new Error('Error');
      // Then
      expect(None<number>().okOr<Error>(new_err)).toStrictEqual(
        Err<number, Error>(new_err)
      );
    });
    test('okOrElse<E extends Error>(err: () => E): Result<T, E>', () => {
      // Given
      const new_err = new Error('Error');
      const f = jest.fn().mockImplementation((): Error => new_err);

      // Then
      expect(None<number>().okOrElse<Error>(f)).toStrictEqual(
        Err<number, Error>(new_err)
      );
      expect(f).toHaveBeenCalled();
    });
    test('and(opt: Option<T>): None<T>', () => {
      expect(None().and(Some(5))).toStrictEqual(None());
    });
    test('andThen<U>(f: (arg0: T) => Option<U>): None<U>', () => {
      // Given
      const f = jest
        .fn()
        .mockImplementation((v: number): Option<number> => Some(v * 2));
      // Then
      expect(None().andThen(f)).toStrictEqual(None());
      expect(f).not.toHaveBeenCalled();
    });
    test('filter(predicate: (arg0: T) => boolean): None<T>', () => {
      // Given
      const predicate = jest.fn().mockImplementation((v: number) => v >= 10);
      // Then
      expect(None().filter(predicate)).toStrictEqual(None());
      expect(predicate).not.toHaveBeenCalled();
    });
    test('or(opt: Option<T>): Option<T>', () => {
      expect(None().or(Some(3))).toStrictEqual(Some(3));
    });
    test('orElse(f: () => Option<T>): Option<T>', () => {
      // Given
      const f = jest.fn().mockImplementation((): Option<number> => Some(10));
      // Then
      expect(None().orElse(f)).toStrictEqual(Some(10));
      expect(f).toHaveBeenCalled();
    });
    test('xor(opt: Some<T>): Some<T>', () => {
      expect(None().xor(Some(3))).toStrictEqual(Some(3));
    });
    test('xor(opt: None<T>): None<T>', () => {
      expect(None().xor(None())).toStrictEqual(None());
    });
    test('zip<U>(right: Option<U>): Option<[T, U]>', () => {
      expect(None().zip(Some(3))).toStrictEqual(None());
    });
    test('match<U>(resolver: OptionMatchResolver<T, U>): U', () => {
      // Given
      const resolver = {
        Some: jest.fn().mockImplementation((v: number): number => v * 2),
        None: jest.fn().mockImplementation((): number => 0),
      };
      // Then
      expect(None().match(resolver)).toEqual(0);
      expect(resolver.Some).not.toHaveBeenCalled();
      expect(resolver.None).toHaveBeenCalled();
    });
  });

  describe('(static) Option.ofNullable', () => {
    test('Option.ofNullable(undefined) -> None', () =>
      expect(Option.ofNullable<string>(undefined)).toStrictEqual(
        None<string>()
      ));
    test('Option.ofNullable(!null) -> Some', () =>
      expect(Option.ofNullable<string>('foo')).toStrictEqual(Some('foo')));
  });
});

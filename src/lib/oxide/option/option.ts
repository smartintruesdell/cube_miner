/**
 * The Option typeclass for Typescript
 *
 * Lifted basically whole-cloth from the Rust standard library.
 *
 * @authors
 *   Shawn Martin-Truesdell (struesdell) <shawn@martin-truesdell.com>
 */
import { Result, Ok, Err } from '../result';

/**
 * @interface OptionMatchResolver<T,U>
 * @see Some.matches, None.matches
 * @property { (arg0:T) => U } Some A method to invoke if the Option is Some
 * @property { () => U } None A method to invoke if the Option is None
 */
interface OptionMatchResolver<T, U> {
  Some: (arg0: T) => U;
  None: () => U;
}

/**
 * The Option typeClass for modeling data that can be undefined/null
 *
 * @class Option
 * @abstract
 */
export abstract class Option<T> {
  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @returns { boolean }
   */
  abstract isSome(): boolean;

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @returns { boolean }
   */
  abstract isNone(): boolean;

  /**
   * Returns `true` if the option is a `Some` value containing the given value.
   *
   * @param { T } value
   * @returns { boolean }
   */
  abstract contains(arg0: T): boolean;

  /**
   * Returns the contained `Some` value.
   *
   * @param { string } msg
   * @throws Throws if the option is `None` with the custom message provided by `msg`
   * @returns { T }
   */
  abstract expect(arg0: string): T;

  /**
   * Returns the contained `Some` value.
   *
   * Because this function may throw, prefer `unwrap_or` or `unwrap_or_else`
   * explicitly.
   *
   * @throws Throws if the option is `None`.
   */
  abstract unwrap(): T;

  /**
   * Returns the contained `Some` value, or if it is `None`, returns the value
   * provided by `fb`
   *
   * @param { T } fb
   * @returns { T }
   */
  abstract unwrapOr(fb: T): T;

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * @param { () => T } f
   * @returns { T }
   */
  abstract unwrapOrElse(f: () => T): T;

  /**
   * Maps an `Option<T>` to an `Option<U>` by applying a function to the
   * contained value.
   *
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  abstract map<U>(f: (arg0: T) => U): Option<U>;

  /**
   * Applies a function to the contained value (if any), or returns the
   * provided default (if not).
   *
   * @param { U } fb A fallback to use if the option was `None`
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  abstract mapOr<U>(fb: U, f: (arg0: T) => U): Option<U>;

  /**
   * Applies a function to the contained value (if any), or computes a default
   * from a provided callback (if not).
   *
   * @param { () => U } d A callback to invoke if the option is `None`.
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  abstract mapOrElse<U>(d: () => U, f: (arg0: T) => U): Option<U>;

  /**
   * Transforms an `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err)`
   *
   * @param { Error } err
   * @returns { Result<T, E> }
   */
  abstract okOr<E extends Error>(err: E): Result<T, E>;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err())`.
   *
   * @param { () => E extends Error } d A callback to invoke if the option is `None`
   * @returns { Result<T, E> }
   */
  abstract okOrElse<E extends Error>(err: () => E): Result<T, E>;

  /**
   * Returns `None` if the Option is `None`, otherwise returns opt.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  abstract and(opt: Option<T>): Option<T>;

  /**
   *  Returns `None` if the option is `None`, otherwise calls the provided
   *  function with the wrapped value and returns the result.
   *
   * @param { (arg0: T) => Option<U> } f
   * @returns { Option<U> }
   */
  abstract andThen<U>(f: (arg0: T) => Option<U>): Option<U>;

  /**
   * Returns None if the option is None, otherwise calls predicate with the
   * wrapped value and returns:
   * - Some if predicate returns true, and
   * - None if predicate returns false.
   *
   * @param { (arg0: T) => boolean } predicate
   * @returns { Option<T> }
   */
  abstract filter(predicate: (arg0: T) => boolean): Option<T>;

  /**
   * Returns the Option if it contains a value, otherwise returns `opt`
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  abstract or(opt: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls f and
   * returns the result.
   *
   * @param { () => Option<T> } f
   * @returns { Option<T> }
   */
  abstract orElse(f: () => Option<T>): Option<T>;

  /**
   * Returns Some if exactly one of self, opt is Some, otherwise returns
   * None.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  abstract xor(opt: Option<T>): Option<T>;

  /**
   * Zips two Options together.
   *
   * If the Option is `Some(T)` and `opt` is `Some<U>`, returns `Some<[T,U]>`.
   * Otherwise, `None` is returned.
   *
   * @param { Option<U> } opt
   * @returns { Option<[T, U]> }
   */
  abstract zip<U>(right: Option<U>): Option<[T, U]>;

  /**
   * Performs pattern matching on the Option.
   *
   * @param { OptionmatchResolver<T, U> } resolver
   * @returns { U }
   */
  abstract match<U>(resolver: OptionMatchResolver<T, U>): U;

  /**
   * Given a value that might be `undefined` or `null`, returns `Some` if it is not
   * one of those values and returns `None` if it is.
   *
   * @param { T } value
   * @returns { Option<T> }
   */
  static ofNullable<T>(value: T | undefined): Option<T> {
    return value === undefined || value === null ? None<T>() : Some<T>(value);
  }
}

class SomeOption<T> extends Option<T> {
  value: T;

  constructor(value: T) {
    super();
    this.value = value;

    Object.freeze(this);
  }

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @returns { boolean }
   */
  isSome(): boolean {
    return true;
  }

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @returns { boolean }
   */
  isNone(): boolean {
    return false;
  }

  /**
   * Returns `true` if the option is a `Some` value containing the given value.
   *
   * @param { T } value
   * @returns { boolean }
   */
  contains(value: T): boolean {
    return this.value === value;
  }

  /**
   * Returns the contained `Some` value.
   *
   * @param { string } msg
   * @throws throws if the option is `None` with the custom message provided by `msg`
   * @returns { T }
   */
  expect(_msg: string): T {
    return this.value;
  }

  /**
   * Returns the contained `Some` value.
   *
   * Because this function may throw, prefer `unwrap_or` or `unwrap_or_else`
   * explicitly.
   *
   * @throws Throws if the option is `None`.
   */
  unwrap(): T {
    return this.value;
  }

  /**
   * Returns the contained `Some` value, or if it is `None`, returns the value
   * provided by `fb`
   *
   * @param { T } fb
   * @returns { T }
   */
  unwrapOr(_fb: T): T {
    return this.unwrap();
  }

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * @param { () => T } f
   * @returns { T }
   */
  unwrapOrElse(_f: () => T): T {
    return this.unwrap();
  }

  /**
   * Maps an `Option<T>` to an `Option<U>` by applying a function to the
   * contained value.
   *
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  map<U>(f: (arg0: T) => U): Option<U> {
    return Some(f(this.value));
  }

  /**
   * Applies a function to the contained value (if any), or returns the
   * provided default (if not).
   *
   * @param { U } fb A fallback to use if the option was `None`
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  mapOr<U>(_fb: U, f: (arg0: T) => U): Option<U> {
    return this.map(f);
  }

  /**
   * Applies a function to the contained value (if any), or computes a default
   * from a provided callback (if not).
   *
   * @param { () => U } d A callback to invoke if the option is `None`.
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  mapOrElse<U>(_d: () => U, f: (arg0: T) => U): Option<U> {
    return this.map(f);
  }

  /**
   * Transforms an `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err)`
   *
   * @param { Error } err
   * @returns { Result<T, E> }
   */
  okOr<E>(_err: E): Result<T, E> {
    return Ok<T, E>(this.value);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err())`.
   *
   * @param { () => E extends Error } d A callback to invoke if the option is `None`
   * @returns { Result<T, E> }
   */
  okOrElse<E>(_d: () => E): Result<T, E> {
    return Ok<T, E>(this.value);
  }

  /**
   * Returns `None` if the Option is `None`, otherwise returns opt.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  and(opt: Option<T>): Option<T> {
    return opt;
  }

  /**
   *  Returns `None` if the option is `None`, otherwise calls the provided
   *  function with the wrapped value and returns the result.
   *
   * @param { (arg0: T) => Option<U> } f
   * @returns { Option<U> }
   */
  andThen<U>(f: (arg0: T) => Option<U>): Option<U> {
    return f(this.value);
  }

  /**
   * Returns None if the option is None, otherwise calls predicate with the
   * wrapped value and returns:
   * - Some if predicate returns true, and
   * - None if predicate returns false.
   *
   * @param { (arg0: T) => boolean } predicate
   * @returns { Option<T> }
   */
  filter(predicate: (arg0: T) => boolean): Option<T> {
    if (predicate(this.value)) {
      return this;
    }
    return None<T>();
  }

  /**
   * Returns the Option if it contains a value, otherwise returns `opt`
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  or(_opt: Option<T>): Option<T> {
    return this;
  }

  /**
   * Returns the option if it contains a value, otherwise calls f and
   * returns the result.
   *
   * @param { () => Option<T> } f
   * @returns { Option<T> }
   */
  orElse(_f: () => Option<T>): Option<T> {
    return this;
  }

  /**
   * Returns Some if exactly one of self, opt is Some, otherwise returns
   * None.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  xor(opt: Option<T>): Option<T> {
    if (opt.isNone()) {
      return this;
    }
    return None<T>();
  }

  /**
   *  Zips two Options together.
   *
   *  If the Option is `Some(T)` and `opt` is `Some<U>`, returns `Some<[T,U]>`.
   *  Otherwise, `None` is returned.
   *
   * @param { Option<U> } opt
   * @returns { Option<[T, U]> }
   */
  zip<U>(opt: Option<U>): Option<[T, U]> {
    if (opt.isSome()) {
      return Some<[T, U]>([this.value, opt.unwrap()]);
    }
    return None<[T, U]>();
  }

  /**
   * Performs pattern matching on the Option.
   *
   * @param { OptionMatchResolver<T, U> } resolver
   * @returns { U }
   */
  match<U>(resolver: OptionMatchResolver<T, U>): U {
    return resolver.Some(this.value);
  }
}

class NoneOption<T> extends Option<T> {
  constructor() {
    super();

    Object.freeze(this);
  }

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @returns { boolean }
   */
  isSome(): boolean {
    return false;
  }

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @returns { boolean }
   */
  isNone(): boolean {
    return true;
  }

  /**
   * Returns `true` if the option is a `Some` value containing the given value.
   *
   * @param { T } value
   * @returns { boolean }
   */
  contains(_value: T): boolean {
    return false;
  }

  /**
   * Returns the contained `Some` value.
   *
   * @param { string } msg
   * @throws throws if the option is `None` with the custom message provided by `msg`
   * @returns { T }
   */
  expect(msg: string): T {
    throw new Error(msg);
  }

  /**
   * Returns the contained `Some` value.
   *
   * Because this function may throw, prefer `unwrap_or` or `unwrap_or_else`
   * explicitly.
   *
   * @throws Throws if the option is `None`.
   */
  unwrap(): T {
    throw new Error('Tried to unwrap a None option');
  }

  /**
   * Returns the contained `Some` value, or if it is `None`, returns the value
   * provided by `fb`
   *
   * @param { T } fb
   * @returns { T }
   */
  unwrapOr(fb: T): T {
    return fb;
  }

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * @param { () => T } f
   * @returns { T }
   */
  unwrapOrElse(f: () => T): T {
    return f();
  }

  /**
   * Maps an `Option<T>` to an `Option<U>` by applying a function to the
   * contained value.
   *
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  map<U>(_f: (arg0: T) => U): Option<U> {
    return None<U>();
  }

  /**
   * Applies a function to the contained value (if any), or returns the
   * provided default (if not).
   *
   * @param { U } fb A fallback to use if the option was `None`
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  mapOr<U>(fb: U, _f: (arg0: T) => U): Option<U> {
    return Some(fb);
  }

  /**
   * Applies a function to the contained value (if any), or computes a default
   * from a provided callback (if not).
   *
   * @param { () => U } d A callback to invoke if the option is `None`.
   * @param { (arg0: T) => U } f
   * @returns { Option<U> }
   */
  mapOrElse<U>(d: () => U, _f: (arg0: T) => U): Option<U> {
    return Some(d());
  }

  /**
   * Transforms an `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err)`
   *
   * @param { E } err
   * @returns { Result<T, E> }
   */
  okOr<E>(err: E): Result<T, E> {
    return Err<T, E>(err);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to
   * `Ok(v)` and `None` to `Err(err())`.
   *
   * @param { () => E extends Error } d A callback to invoke if the option is `None`
   * @returns { Result<T, E> }
   */
  okOrElse<E>(d: () => E) {
    return Err<T, E>(d());
  }

  /**
   * Returns `None` if the Option is `None`, otherwise returns opt.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  and(_opt: Option<T>): Option<T> {
    return None<T>();
  }

  /**
   *  Returns `None` if the option is `None`, otherwise calls the provided
   *  function with the wrapped value and returns the result.
   *
   * @param { (arg0: T) => Option<U> } f
   * @returns { Option<U> }
   */
  andThen<U>(_f: (arg0: T) => Option<U>): Option<U> {
    return None<U>();
  }

  /**
   * Returns None if the option is None, otherwise calls predicate with the
   * wrapped value and returns:
   * - Some if predicate returns true, and
   * - None if predicate returns false.
   *
   * @param { (arg0: T) => boolean } predicate
   * @returns { Option<T> }
   */
  filter(_predicate: (arg0: T) => boolean): Option<T> {
    return None<T>();
  }

  /**
   * Returns the Option if it contains a value, otherwise returns `opt`
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  or(opt: Option<T>): Option<T> {
    return opt;
  }

  /**
   * Returns the option if it contains a value, otherwise calls f and
   * returns the result.
   *
   * @param { () => Option<T> } f
   * @returns { Option<T> }
   */
  orElse(f: () => Option<T>): Option<T> {
    return f();
  }

  /**
   * Returns Some if exactly one of self, opt is Some, otherwise returns
   * None.
   *
   * @param { Option<T> } opt
   * @returns { Option<T> }
   */
  xor(opt: Option<T>): Option<T> {
    if (opt.isSome()) {
      return opt;
    }
    return None<T>();
  }

  /**
   *  Zips two Options together.
   *
   *  If the Option is `Some(T)` and `opt` is `Some<U>`, returns `Some<[T,U]>`.
   *  Otherwise, `None` is returned.
   *
   * @param { Option<U> } opt
   * @returns { Option<[T, U]> }
   */
  zip<U>(opt: Option<U>): Option<[T, U]> {
    return None<[T, U]>();
  }

  /**
   * Performs pattern matching on the Option.
   *
   * @param { OptionmatchResolver<T, U> } resolver
   * @returns { U }
   */
  match<U>(resolver: OptionMatchResolver<T, U>): U {
    return resolver.None();
  }
}

/** Constructs a new Some Option */
export function Some<T>(value: T): Option<T> {
  return new SomeOption<T>(value);
}

/** Constructs a new None Option */
export function None<T>(): Option<T> {
  return new NoneOption<T>();
}

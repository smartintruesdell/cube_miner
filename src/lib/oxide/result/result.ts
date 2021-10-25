/**
 * The Result typeclass for Typescript
 *
 * Lifted basically whole-cloth from the Rust standard library.
 *
 * @authors
 *   Shawn Martin-Truesdell (struesdell) <shawn@martin-truesdell.com>
 */
import { Option, Some, None } from '../option';

/**
 * @interface ResultMatchResolver<T,U,E>
 * @see Ok.matches, Err.matches
 * @property { (arg0:T) => U } Ok A method to invoke if the result matches the Ok type
 * @property { (arg0:E) => U } Err A method to invoke if the result matches the Err type
 */
interface ResultMatchResolver<T, U, E> {
  Ok: (arg0: T) => U;
  Err: (arg0: E) => U;
}

/**
 * Models the result of an operation that can fail.
 *
 * @class Result
 * @abstract
 */
export abstract class Result<T, E> {
  /**
   * Returns `true` if the result is `Err`.
   *
   * @returns { boolean }
   */
  abstract isErr(): boolean;

  /**
   * Returns `true` if the result is `Ok`.
   *
   * @returns { boolean }
   */
  abstract isOk(): boolean;

  /**
   * Returns `true` if the result is `Ok` and contains the value provided.
   *
   * @param { T } arg0
   * @returns { boolean}
   */
  abstract contains(arg0: T): boolean;

  /**
   * Returns `true` if the result is an `Err` value containing the given error.
   *
   * @param { E } arg0
   * @returns { boolean }
   */
  abstract containsErr(arg0: E): boolean;

  /**
   * Converts an `Ok` result into an `Option`, discarding errors.
   *
   * @returns { Option<T> }
   */
  abstract ok(): Option<T>;

  /**
   * Converts an `Err` result into an `Option`, discarding the success value, if
   * any.
   *
   * @returns { Option<E> }
   */
  abstract err(): Option<E>;

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a
   * contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param { (arg0: T) => U } arg0
   * @returns { Result<U, E> }
   */
  abstract map<U>(arg0: (arg0: T) => U): Result<U, E>;

  /**
   * Applies a function to the contained value (if `Ok`), or returns the
   * provided default (if `Err`).
   *
   * @param { U } arg0 A default value if the result is `Err`
   * @param { (arg0: T) => U } arg1 A transformation to apply if the result is `Ok`
   * @returns { Result<U, E> }
   */
  abstract mapOr<U>(arg0: U, arg1: (arg0: T) => U): Result<U, E>;

  /**
   * Maps a `Result<T, E>` to `U` by applying a function to a contained `Ok`
   * value, or a fallback function to a contained `Err` value.
   *
   * @param { (arg0: E) => U } arg0 A transformation to apply if the result is `Err`
   * @param { (arg0: T) => U } arg1 A transformation to apply if the result is `Ok`
   * @returns { Result<U, E> }
   */
  abstract mapOrElse<U>(
    arg0: (arg0: E) => U,
    arg1: (arg0: T) => U
  ): Result<U, E>;

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * @param { (arg0: E) => F } arg0 A transformation to apply if the result is `Err`
   * @returns { Result<T, F> }
   */
  abstract mapErr<F>(arg0: (arg0: E) => F): Result<T, F>;

  /**
   * Returns `arg0` if the result is `Ok`, otherwise returns the `Err` value of
   * `self`
   *
   * @param { Result<T, E> } arg0
   * @returns { Result<T, E> }
   */
  abstract and(arg0: Result<T, E>): Result<T, E>;

  /**
   * Calls `arg0` if the result is `Ok`, otherwise returns the `Err` value of the
   * result.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * @param { (arg0: T) => Result<U, E> } arg0
   * @returns { Result<U, E> }
   */
  abstract andThen<U>(arg0: (arg0: T) => Result<U, E>): Result<U, E>;

  /**
   * Returns `arg0` if the result is `Err`, otherwise returns the `Ok` value of
   * self.
   *
   * @param { Result<T, E> } arg0
   * @returns { Result<T, E>}
   */
  abstract or(arg0: Result<T, E>): Result<T, E>;

  /**
   * Calls `arg0` if the result is `Err`, otherwise returns the `Ok` value of
   * self.
   *
   * @param { (arg0: E) => Result<T, F> } arg0
   * @returns { Result<T, F> }
   */
  abstract orElse<F>(arg0: (arg0: E) => Result<T, F>): Result<T, F>;

  /**
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the `Err` case
   * explicitly, or call `unwrapOr`, `unwrapOrElse`.
   *
   * @throws Throws if the value is an `Err`, with an error message provided by
   * the `Err`'s value.
   *
   * @returns { T }
   */
  abstract unwrap(): T;

  /**
   * Returns the contained `Ok` value or a provided default.
   *
   * @param { T } arg0 A default value to use if the result is `Err`
   * @returns { T }
   */
  abstract unwrapOr(fb: T): T;

  /**
   * Returns the contained `Ok` value or computes it from a closure.
   *
   * @param { (arg0: E) => T } arg0
   * @returns { T }
   */
  abstract unwrapOrElse(arg0: (arg0: E) => T): T;

  /**
   * Returns the contained Ok value.
   *
   * @param { string } arg0
   *
   * @throws Throws if the value is an `Err`, with an error message including
   * the passed `arg0` message, and the content of the `Err`.
   *
   * @returns { T }
   */
  abstract expect(arg0: string): T;

  /**
   * Returns the contained Err value.
   *
   * @param { string } arg0
   *
   * @throws Throws if the value is an `Ok`, with an error message including the
   * passed `msg`, and the content of the `Ok`.
   *
   * @returns { E }
   */
  abstract expectErr(arg0: string): E;

  /**
   * Performs pattern matching on this Result
   *
   * @param { ResultMatchResolver<T, U> } resolver
   * @returns { U }
   */
  abstract match<U>(resolver: ResultMatchResolver<T, U, E>): U;
}

class OkResult<T, E> extends Result<T, E> {
  private readonly value: T;

  constructor(value: T) {
    super();
    this.value = value;

    Object.freeze(this);
  }

  /**
   * Returns `true` if the result is `Err`.
   * @returns { boolean }
   */
  isErr(): boolean {
    return false;
  }

  /**
   * Returns `true` if the result is `Ok`.
   * @returns { boolean }
   */
  isOk(): boolean {
    return true;
  }

  /**
   * Returns `true` if the result is an `Ok` value containing the given value.
   * @param { any } value
   * @returns { boolean }
   */
  contains(value: T): boolean {
    return this.value === value;
  }

  /**
   * Returns `true` if the result is an `Ok` value containing the given value.
   * @param { Error } error
   * @returns { boolean }
   */
  containsErr(_error: E): boolean {
    return false;
  }

  /**
   * Converts an `Ok` result into an `Option`, discarding errors.
   * @returns { Option<T> }
   */
  ok(): Option<T> {
    return Some(this.value);
  }

  /**
   * Converts an `Err` result into an `Option`, discarding the success value, if any.
   * @returns { Option<E> }
   */
  err(): Option<E> {
    return None<E>();
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
   * leaving an `Err` value untouched.
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result.
   * @returns { Result<U, E> }
   */
  map<U>(f: (arg0: T) => U): Result<U, E> {
    return Ok(f(this.value));
  }

  /**
   * Applies a function to the contained value (if `Ok`), or returns the provided default (if `Err`)
   *
   * @param { U } fb A default value to return if the Result is Err.
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result if it is Ok.
   * @returns { Result<U, E> }
   */
  mapOr<U>(_fb: U, f: (arg0: T) => U): Result<U, E> {
    return this.map(f);
  }

  /**
   * Maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value, or a fallback
   * function to a contained `Err` value.
   *
   * @param { (arg0: E) -> U } fb A function apply to the contents of the Result if that result is Err
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result if that result is Er
   * @returns { Result<U, E> }
   */
  mapOrElse<U>(_fb: (arg0: E) => U, f: (arg0: T) => U): Result<U, E> {
    return this.map(f);
  }

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * @param { (arg0: E) => F } f A function to apply to the contained Error if the result is Err.
   * @returns { Result<T, F> }
   */
  mapErr<F>(_f: (arg0: E) => F): Result<T, F> {
    return Ok<T, F>(this.value);
  }

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value
   * of `self`
   *
   * @param { Result<U,E> } res
   * @returns { Result<U, E> }
   */
  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value of
   * the result.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * @param { (arg0: T) => Result<U, E> } f
   *   A function to apply to the contents of the Result if it is Ok, which must
   *   return a new Result.
   * @returns { Result<U, E> }
   */
  andThen<U>(f: (arg0: T) => Result<U, E>): Result<U, E> {
    return f(this.value);
  }

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok`
   * value of self.
   *
   * @param { Result<T, E> } res
   * @returns { Result<T, E> }
   */
  or(_res: Result<T, E>): Result<T, E> {
    return Ok<T, E>(this.value);
  }

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value of self.
   *
   * @param { (arg0: E) => Result<T, F> } f A function to apply to the Error if the result is Err.
   * @returns { Result<T, F> }
   */
  orElse<F>(_f: (arg0: E) => Result<T, F>): Result<T, F> {
    return Ok<T, F>(this.value);
  }

  /**
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the `Err` case
   * explicitly, or call `unwrap_or`, `unwrap_or_else`.
   *
   * @throws Throws if the value is an `Err`, with an error message provided by the `Err`'s value.
   * @returns { T } Returns the contained value if the result is Ok.
   */
  unwrap() {
    return this.value;
  }

  /**
   * Returns the contained `Ok` value or a provided default.
   *
   * @param { T } fb A fallback if the result was Err.
   * @returns { T }
   */
  unwrapOr(_fb: T): T {
    return this.unwrap();
  }

  /**
   * Returns the contained `Ok` value or computes it from a closure.
   * @param { (arg0: E) => T } f A function to apply to the contained Error if the result was Err.
   * @returns { T }
   */
  unwrapOrElse(_f: (arg0: E) => T): T {
    return this.unwrap();
  }

  /**
   * Returns the contained Ok value.
   *
   * @param { string } msg An error message.
   * @throws
   *   Throws if the value is an `Err`, with an error message including the passed `msg`, and the
   *   content of the `Err`.
   * @returns { T }
   */
  expect(_msg: string): T {
    return this.value;
  }

  /**
   * Returns the contained Err value.
   *
   * @param { string } msg An error message to throw if the value is Ok.
   * @throws
   *   Throws if the value is an `Ok`, with an error message including the
   *   passed `msg`, and the content of the `Ok`.
   * @returns { E } Returns the contained Error
   */
  expectErr(msg: string): E {
    throw new Error(`${msg}: ${this.value}`);
  }

  /**
   * Performs pattern matching on this Result
   *
   * @param { ResultMatchResolver<T,U,E> } resolver
   *   An object definining both Ok and Err paths for pattern matching.
   * @returns { U }
   */
  match<U>(resolver: ResultMatchResolver<T, U, E>): U {
    return resolver.Ok(this.value);
  }
}

class ErrResult<T, E> extends Result<T, E> {
  private readonly error: E;

  constructor(error: E) {
    super();
    this.error = error;

    Object.freeze(this);
  }

  /**
   * Returns `true` if the result is `Err`.
   * @returns { boolean }
   */
  isErr(): boolean {
    return true;
  }

  /**
   * Returns `true` if the result is `Ok`.
   * @returns { boolean }
   */
  isOk(): boolean {
    return false;
  }

  /**
   * Returns `true` if the result is an `Ok` value containing the given value.
   * @param { any } value
   * @returns { boolean }
   */
  contains(value: T): boolean {
    return false;
  }

  /**
   * Returns `true` if the result is an `Ok` value containing the given value.
   * @param { Error } error
   * @returns { boolean }
   */
  containsErr(error: E): boolean {
    return this.error === error;
  }

  /**
   * Converts an `Ok` result into an `Option`, discarding errors.
   * @returns { Option<T> }
   */
  ok(): Option<T> {
    return None<T>();
  }

  /**
   * Converts an `Err` result into an `Option`, discarding the success value, if any.
   * @returns { Option<T> }
   */
  err(): Option<E> {
    return Some<E>(this.error);
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
   * leaving an `Err` value untouched.
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result.
   * @returns { Result<U, E> }
   */
  map<U>(_f: (arg0: T) => U): Result<U, E> {
    return Err<U, E>(this.error);
  }

  /**
   * Applies a function to the contained value (if `Ok`), or returns the provided default (if `Err`)
   *
   * @param { U } fb A default value to return if the Result is Err.
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result if it is Ok.
   * @returns { Result<U, E> }
   */
  mapOr<U>(fb: U, _f: (arg0: T) => U): Result<U, E> {
    return Ok<U, E>(fb);
  }

  /**
   * Maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value, or a fallback
   * function to a contained `Err` value.
   *
   * @param { (arg0: E) -> U } fb A function apply to the contents of the Result if that result is Err
   * @param { (arg0: T) -> U } f A function apply to the contents of the Result if that result is Er
   * @returns { Result<U, E> }
   */
  mapOrElse<U>(fb: (arg0: E) => U, _f: (arg0: T) => U): Result<U, E> {
    return Ok<U, E>(fb(this.error));
  }

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
   * contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while
   * handling an error.
   *
   * @param { (arg0: E) => F } f A function to apply to the contained Error if the result is Err.
   * @returns { Result<T, F> }
   */
  mapErr<F>(f: (arg0: E) => F): Result<T, F> {
    return Err<T, F>(f(this.error));
  }

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value
   * of `self`
   *
   * @param { Result<T, E> } res
   * @returns { Result<T, E> }
   */
  and<U>(_res: Result<U, E>): Result<U, E> {
    return Err<U, E>(this.error);
  }

  /**
   * Calls `f` if the result is `Ok`, otherwise returns the `Err` value of
   * the result.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * @param { (arg0: T) => Result<U, E> } f
   *   A function to apply to the contents of the Result if it is Ok, which must
   *   return a new Result.
   * @returns { Result<U, E> }
   */
  andThen<U>(_f: (arg0: T) => Result<U, E>): Result<U, E> {
    return Err(this.error);
  }

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok`
   * value of self.
   *
   * @param { Result<T, E> } res
   * @returns { Result<T, E> }
   */
  or(res: Result<T, E>): Result<T, E> {
    return res;
  }

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value of self.
   *
   * @param { (arg0: E) => Result<T, F> } f A function to apply to the Error if the result is Err.
   * @returns { Result<T, F> }
   */
  orElse<F>(f: (arg0: E) => Result<T, F>): Result<T, F> {
    return f(this.error);
  }

  /**
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the `Err` case
   * explicitly, or call `unwrapOr`, `unwrapOrElse`.
   *
   * @throws Throws if the value is an `Err`, with an error message provided by the `Err`'s value.
   * @returns { T } Returns the contained value if the result is Ok.
   */
  unwrap(): T {
    throw new Error(`Attempted to unwrap an Err result: ${this.error}`);
  }

  /**
   * Returns the contained `Ok` value or a provided default.
   *
   * @param { T } fb A fallback if the result was Err.
   * @returns { T }
   */
  unwrapOr(fb: T): T {
    return fb;
  }

  /**
   * Returns the contained `Ok` value or computes it from a closure.
   * @param { (arg0: E) => T } f A function to apply to the contained Error if the result was Err.
   * @returns { T }
   */
  unwrapOrElse(f: (arg0: E) => T): T {
    return f(this.error);
  }

  /**
   * Returns the contained Ok value.
   *
   * @param { string } msg An error message.
   * @throws
   *   Throws if the value is an `Err`, with an error message including the passed `msg`, and the
   *   content of the `Err`.
   * @returns { T }
   */
  expect(msg: string): T {
    if (this.error instanceof Error) {
      this.error.message = `${msg}: ${this.error.message}`;
      throw this.error;
    } else {
      throw `${msg}: ${this.error}`;
    }
  }

  /**
   * Returns the contained Err value.
   *
   * @param { string } msg An error message to throw if the value is Ok.
   * @throws
   *   Throws if the value is an `Ok`, with an error message including the
   *   passed `msg`, and the content of the `Ok`.
   * @returns { E } Returns the contained Error
   */
  expectErr(_msg: string): E {
    return this.error;
  }

  /**
   * Performs pattern matching on this Result
   *
   * @param { ResultMatchResolver<T,U,E> } resolver
   *   An object definining both Ok and Err paths for pattern matching.
   * @returns { U }
   */
  match<U>(resolver: ResultMatchResolver<T, U, E>): U {
    return resolver.Err(this.error);
  }
}

/** Constructs a new Ok Result */
export function Ok<T, E>(value: T): Result<T, E> {
  return new OkResult<T, E>(value);
}

/**  Constructs a new Err Result. */
export function Err<T, E>(error: E): Result<T, E> {
  return new ErrResult<T, E>(error);
}

/**
 * The Writer abstraction combines a value and a 'log' that can easily
 * cocatenate messages for you as you compose opertions together.
 *
 * @example
 *
 * const f = (x: number):Writer<number> => Writer(x+1, `Added 1 to ${x}\n`);
 * const g = (x: number):Writer<number> => Writer(x*2, `Multiplied ${x} by 2\n`);
 *
 * const [result, log] =
 *   Writer.of(5)
 *     .andThen(f)
 *     .andThen(g)
 *     .prepend('Procedure:\n')
 *     .append('Done!')
 *     .unwrapPair();
 *
 * assert.equal(
 *   'Procedure:\nAdded 1 to 5\nMultiplied 6 by 2\nDone!',
 *   result
 * );
 *
 */
export class Writer<T> {
  readonly value: T;
  readonly message: string;

  constructor([value, message]: [T, string]) {
    this.value = value;
    this.message = message;

    Object.freeze(this);
  }

  isWriter(): boolean {
    return true;
  }

  andThen<U>(fn: (value: T) => Writer<U>): Writer<U> {
    return fn(this.value).prepend(this.message);
  }

  append(msg: string): Writer<T> {
    return Writer.of(this.value, this.message.concat(msg));
  }

  equals(wtr: Writer<T>): boolean {
    const [wtr_val, wtr_msg] = wtr.unwrapPair();

    const value_match = this.value === wtr_val;
    const message_match = this.message === wtr_msg;

    return value_match && message_match;
  }

  map<U>(fn: (value: T) => U): Writer<U> {
    return Writer.of(fn(this.value), this.message);
  }

  prepend(msg: string): Writer<T> {
    return Writer.of(this.value, msg.concat(this.message));
  }

  unwrap(): T {
    return this.value;
  }

  unwrapPair(): [T, string] {
    return [this.value, this.message];
  }

  static of<T>(value: T, msg: string = ''): Writer<T> {
    return new Writer<T>([value, msg]);
  }
}

import { Writer } from './writer';

describe('Writer Monad', () => {
  test('Law 1 - andThen(bind): return x >>= f === f(x)', () => {
    // Given
    const value = 1;
    const f = (v: number): Writer<number> => Writer.of(v + 1);

    // When
    const result = Writer.of(value).andThen(f);

    // Then
    expect(result).toEqual(f(value));
  });
  test('Law 2 - Unit: m >>= return === m', () => {
    // Given
    const value = 1;
    const mw = Writer.of(value);

    // When
    const result = mw.andThen(Writer.of);

    // then
    expect(result.equals(mw)).toBe(true);
  });
  test('Law 3 - Associativity: (m >>= f) >>= g === m >>= (x -> f x >>= g)', () => {
    // Given
    const value = 1;
    const mw = Writer.of(value);
    const f = (v: number): Writer<number> => Writer.of(v + 1);
    const g = (v: number): Writer<number> => Writer.of(v + 2);

    // When
    const first = mw.andThen(f).andThen(g);
    const second = mw.andThen((v: number) => f(v).andThen(g));

    // Then
    expect(first.equals(second)).toBe(true);
  });
  test('andThen appends logs', () => {
    // Given
    const logAdd = (b: number) => (a: number) =>
      Writer.of(a + b, `Added ${b}\n`);

    // When
    const result = Writer.of(1, 'Initial Value was 1\n').andThen(logAdd(2));

    // Then
    expect(result.isWriter()).toBe(true);
    expect(result.value).toEqual(3);
    expect(result.message).toEqual('Initial Value was 1\nAdded 2\n');
  });
  test('map retains logs', () => {
    // Given
    const mw = Writer.of(1, 'Initial Value was 1\n');
    const boringAdd =
      (b: number) =>
      (a: number): number =>
        a + b;

    // When
    const result = mw.map(boringAdd(2));

    // Then
    expect(result.isWriter()).toBe(true);
    expect(result.value).toEqual(3);
    expect(result.message).toEqual('Initial Value was 1\n');
  });
  test.each([
    [new Writer([1, '']), 'next', new Writer([1, 'next'])],
    [new Writer([1, 'start-']), 'next', new Writer([1, 'start-next'])],
  ])(
    'Writer.append(%p) -> Writer',
    (init: Writer<number>, str: string, expected: Writer<number>) =>
      expect(init.append(str)).toStrictEqual(expected)
  );
  test.each([
    [Writer.of(5), 5],
    [Writer.of('foo'), 'foo'],
  ])('Writer(%p).unwrap() -> %p', <T>(example: Writer<T>, expected: T) =>
    expect(example.unwrap()).toBe(expected)
  );
  test.each([
    [Writer.of(1), Writer.of(1), true],
    [Writer.of(1), Writer.of(2), false],
    [Writer.of(1, 'msg'), Writer.of(1, 'msg'), true],
    [Writer.of(1, 'msg'), Writer.of(1, 'gsm'), false],
  ])(
    'Writer(%p).equals(Writer(%p)) -> %p',
    <T>(left: Writer<T>, right: Writer<T>, expected: boolean) =>
      expect(left.equals(right)).toBe(expected)
  );
});

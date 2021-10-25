/**
 * Tests for has.ts
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { has } from './has';

interface TestType {
  foo: string;
}
const test_object: TestType = {
  foo: 'bar',
};

describe('has', () => {
  test.each([
    ['foo' as keyof TestType, test_object, true],
    ['baz' as keyof TestType, test_object, false],
    ['length' as keyof TestType, test_object, false],
  ])('has(%p, <object>)', (key: keyof TestType, record, expected) =>
    expect(has(key, record)).toBe(expected)
  );
  test("has('length', []) -> true", () => expect(has('length', [])).toBe(true));
});

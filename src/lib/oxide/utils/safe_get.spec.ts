/**
 * Tests for safe_get.ts
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { safe_get } from './safe_get';
import { Option, Some, None } from '../option';

interface TestType {
  foo: string;
}

const test_object: TestType = {
  foo: 'bar',
};

describe('safe_get', () => {
  test.each([
    ['foo' as keyof TestType, Some<string>('bar')],
    ['baz' as keyof TestType, None<any>()],
  ])(
    'safe_get(%p, <Object>) -> %p',
    (key: keyof TestType, expected: Option<any>) =>
      expect(safe_get(key, test_object)).toStrictEqual(expected)
  );
});

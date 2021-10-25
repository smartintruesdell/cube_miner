/**
 * Provides a 'looping' mechanism for functional programming without
 * recursion
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */

export const do_while = <T>(
  predicate: (arg0: T) => boolean,
  fn: (arg0: T, arg1: number) => T,
  init: T
): T => {
  let result: T = init;
  let i = 0;

  while (predicate(result)) {
    result = fn(result, i);
    i += 1;
  }
  return result;
};

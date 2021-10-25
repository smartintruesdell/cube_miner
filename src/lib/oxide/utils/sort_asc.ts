/**
 * Utility function for sorting by ascending numeric comparison
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
export function sort_asc<T>(a: T, b: T): number {
  if (
    (typeof a === 'number' && typeof b === 'number') ||
    (typeof a === 'string' && typeof b === 'string')
  ) {
    if (b > a) {
      return -1;
    } else if (b < a) {
      return 1;
    }
  }

  return 0;
}

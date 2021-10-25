/**
 * Utility functions for working with lists in a functional way
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { Option, Some, None } from '../option';

export function head<T>(xa: T[]): T {
  return xa[0];
}

export function safe_head<T>(xa: T[]): Option<T> {
  return xa.length ? Some(xa[0]) : None();
}

export function tail<T>(xa: T[]): T[] {
  const [, ...rest] = xa;

  return rest;
}

export function safe_tail<T>(xa: T[]): Option<T[]> {
  if (xa.length > 1) {
    return Some(tail(xa));
  }
  return None();
}

export function init<T>(xa: T[]): T[] {
  return Array.prototype.slice.call(xa, 0, -1);
}
export function safe_init<T>(xa: T[]): Option<T[]> {
  if (xa.length > 1) {
    return Some(init(xa));
  }
  return None();
}

export function last<T>(xa: T[]): T {
  return xa[xa.length - 1];
}
export function safe_last<T>(xa: T[]): Option<T> {
  if (xa.length) {
    return Some(last(xa));
  }
  return None();
}

export const safe_find = <T>(
  predicate: (v: T) => boolean,
  xt: T[]
): Option<T> =>
  xt.reduce(
    (acc: Option<T>, next: T) =>
      acc.orElse(() => (predicate(next) ? Some(next) : None())),
    None()
  );

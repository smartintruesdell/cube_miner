/**
 * Utility for safely (with Option) retrieving a value from a Record
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import { Option, Some, None } from '../option';
import { has } from './has';

export const safe_get = <T>(key: keyof T, obj: T): Option<T[keyof T]> =>
  has(key, obj) ? Some(obj[key]) : None();

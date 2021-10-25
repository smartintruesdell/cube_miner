/**
 * Wrapper around Object.prototype.hasOwnProperty
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
export const has = <T>(prop: keyof T, obj: T): boolean =>
  Object.prototype.hasOwnProperty.call(obj, prop);

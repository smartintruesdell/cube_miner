import { Option, Some, None } from '../oxide';
import dotenv = require('dotenv');

export function init(): void {
  dotenv.config();
}

export function get(key: string): Option<string> {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    return Some(process.env[key] || '');
  }
  return None<string>();
}

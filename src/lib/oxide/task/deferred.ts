/**
 * @fileOverview
 * @name deferred.ts
 * @description the Deferred abstraction for handling promise-like behavior
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import {
  DeferredError,
  IDeferred,
  IDeferredListener,
  IDeferredState,
} from './interfaces';
import { EXECUTION_STATE } from './execution-state';

export class Deferred<T> implements IDeferred<T> {
  _state: IDeferredState<T>;
  _listeners: IDeferredListener<T>[];

  constructor() {
    this._state = {
      state: EXECUTION_STATE.PENDING,
    };
    this._listeners = [];
  }

  resolve(value: T): Deferred<T> {
    return Deferred.moveToState<T>(
      {
        state: EXECUTION_STATE.RESOLVED,
        value,
      },
      this
    );
  }

  reject(reason: DeferredError): Deferred<T> {
    return Deferred.moveToState<T>(
      {
        state: EXECUTION_STATE.REJECTED,
        reason,
      },
      this
    );
  }

  cancel(): Deferred<T> {
    return Deferred.moveToState<T>(
      {
        state: EXECUTION_STATE.CANCELLED,
      },
      this
    );
  }

  maybeCancel(): Deferred<T> {
    if (this._state.state === EXECUTION_STATE.PENDING) {
      return this.cancel();
    }
    return this;
  }

  static moveToState<T>(
    newState: IDeferredState<T>,
    dt: Deferred<T>
  ): Deferred<T> {
    if (dt._state.state !== EXECUTION_STATE.PENDING) {
      throw new Error(
        `Only pending deferreds can be ${
          EXECUTION_STATE[newState.state]
        }. This deferred is already ${EXECUTION_STATE[dt._state.state]}`
      );
    }
    dt._state = newState;

    const listeners = dt._listeners;
    listeners.forEach((listener) => {
      switch (dt._state.state) {
        case EXECUTION_STATE.RESOLVED:
          listener.onResolved &&
            dt._state.value &&
            listener.onResolved(dt._state.value);
          break;
        case EXECUTION_STATE.REJECTED:
          listener.onRejected && listener.onRejected(dt._state.reason);
          break;
        case EXECUTION_STATE.CANCELLED:
          listener.onCancelled && listener.onCancelled();
          break;
        default:
      }
    });

    dt._listeners = [];

    return dt;
  }

  listen(pattern: IDeferredListener<T>): Deferred<T> {
    switch (this._state.state) {
      case EXECUTION_STATE.PENDING:
        this._listeners.push(pattern);
        break;
      case EXECUTION_STATE.CANCELLED:
        pattern.onCancelled && pattern.onCancelled();
        break;
      case EXECUTION_STATE.RESOLVED:
        pattern.onResolved &&
          this._state.value &&
          pattern.onResolved(this._state.value);
        break;
      case EXECUTION_STATE.REJECTED:
        pattern.onRejected && pattern.onRejected(this._state.reason);
        break;
    }
    return this;
  }

  promise(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.listen({
        onCancelled: () => reject('Cancelled'),
        onResolved: resolve,
        onRejected: reject,
      });
    });
  }
}

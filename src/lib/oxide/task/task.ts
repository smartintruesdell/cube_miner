/**
 * The Task monad for asynchronous operations
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import {
  ITask,
  ITaskResolver,
  TaskComputation,
  DeferredError,
  NoOp,
} from './interfaces';
import { TaskExecution } from './task-execution';
import { Deferred } from './deferred';

export class Task<T> implements ITask<T> {
  _computation: TaskComputation<T>;

  constructor(computation: TaskComputation<T>) {
    this._computation = computation;
  }

  /**
   * @method
   * @name andThen
   * @description
   *   Takes a function that returns a new task and calls that task with the
   *   result from this task's resolution.
   */
  andThen<U>(transformation: (arg0: T) => Task<U>): Task<U> {
    return new Task<U>((resolver: ITaskResolver<U>) => {
      const execution: TaskExecution<T> = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected: resolver.reject,
        onResolved: (value: T) => {
          let transformed: Task<U>;

          try {
            transformed = transformation(value);
          } catch (e) {
            return resolver.reject(e as DeferredError);
          }

          transformed &&
            execution.link(
              transformed.run().listen({
                onCancelled: resolver.cancel,
                onRejected: resolver.reject,
                onResolved: resolver.resolve,
              })
            );
        },
      });
    });
  }

  map<U>(transformation: (arg0: T) => U): Task<U> {
    return new Task((resolver) => {
      const execution: TaskExecution<T> = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected: resolver.reject,
        onResolved: (value: T) => {
          try {
            return resolver.resolve(transformation(value));
          } catch (e) {
            return resolver.reject(e as DeferredError);
          }
        },
      });
    });
  }

  run(): TaskExecution<T> {
    const deferred = new Deferred<T>();
    let cleanups: NoOp[] = [];
    let cancellations: NoOp[] = [];
    let isCancelled = false;
    let done = false;

    const resolveCleanup = (): void => {
      cleanups.forEach((f) => f());
      cleanups = [];
    };
    const resolveCancellations = (): void => {
      cancellations.forEach((f) => f());
      cancellations = [];
    };

    deferred.listen({
      onCancelled: () => {
        done = true;
        isCancelled = true;
        resolveCleanup();
        resolveCancellations();
      },
      onResolved: (_value: T) => {
        done = true;
        resolveCleanup();
        cancellations = [];
      },
      onRejected: (_reason?: DeferredError) => {
        done = true;
        resolveCleanup();
        cancellations = [];
      },
    });

    const execution = new TaskExecution(this, deferred);

    const resolver: ITaskResolver<T> = {
      reject: (reason?: DeferredError): void => {
        if (!isCancelled) {
          deferred.reject(reason);
        }
      },
      resolve: (value: T): void => {
        if (!isCancelled) {
          deferred.resolve(value);
        }
      },
      cancel: () => {
        deferred.maybeCancel();
      },
      get isCancelled() {
        return isCancelled;
      },
      cleanup(f: NoOp) {
        if (done) {
          throw new Error(
            "Can't attach a cleanup handler after the task is resolved."
          );
        }
        cleanups.push(f);
      },
      onCancelled(f: NoOp) {
        if (done) {
          throw new Error(
            "Can't attach a cancellation handler after the task is completed"
          );
        }
        cancellations.push(f);
      },
    };

    // Note: This is where the operation is actually executed.
    this._computation(resolver);

    return execution;
  }

  orElse(handler: (reason?: DeferredError) => Task<any>): Task<any> {
    return new Task<any>((resolver: ITaskResolver<T>) => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onResolved: resolver.resolve,
        onRejected: (reason) => {
          execution.link(
            handler(reason).run().listen({
              onCancelled: resolver.cancel,
              onRejected: resolver.reject,
              onResolved: resolver.resolve,
            })
          );
        },
      });
    });
  }

  static of<T>(value: T): Task<T> {
    return new Task<T>(({ resolve }) => resolve(value));
  }

  static rejected<T>(reason?: DeferredError): Task<T> {
    return new Task<T>(({ reject }) => reject(reason));
  }

  static and<T, T2>(left: Task<T>, right: Task<T2>): Task<[T, T2]> {
    return new Task<[T, T2]>((resolver: ITaskResolver<[T, T2]>) => {
      const leftExecution = left.run();
      const rightExecution = right.run();

      const values: [T?, T2?] = [undefined, undefined];
      let doneLeft = false;
      let doneRight = false;
      let cancelled = false;

      resolver.onCancelled(() => {
        leftExecution.cancel();
        rightExecution.cancel();
      });

      function guardResolve<A>(setter: (value: A) => void): (value: A) => void {
        return (value: A) => {
          if (cancelled) {
            return;
          }

          setter(value);
          if (doneLeft && doneRight) {
            resolver.resolve(values as [T, T2]);
          }
        };
      }

      const guardRejection =
        (fn: (arg0?: DeferredError) => void, execution: TaskExecution<any>) =>
        (reason?: DeferredError) => {
          if (cancelled) {
            return;
          }

          cancelled = true;
          execution.cancel();

          fn(reason);
        };

      leftExecution.listen({
        onRejected: guardRejection(resolver.reject, rightExecution),
        onCancelled: guardRejection(resolver.cancel, rightExecution),
        onResolved: guardResolve<T>((value: T) => {
          values[0] = value;
          doneLeft = true;
        }),
      });
      rightExecution.listen({
        onRejected: guardRejection(resolver.reject, leftExecution),
        onCancelled: guardRejection(resolver.cancel, leftExecution),
        onResolved: guardResolve<T2>((value: T2) => {
          values[1] = value;
          doneRight = true;
        }),
      });
    });
  }

  static or<T, T2>(left: Task<T>, right: Task<T2>): Task<T | T2> {
    return new Task<T | T2>((resolver: ITaskResolver<T | T2>) => {
      const leftExecution = left.run();
      const rightExecution = right.run();
      let done = false;

      resolver.onCancelled(() => {
        leftExecution.cancel();
        rightExecution.cancel();
      });

      function guardRejection(
        fn: (arg0?: DeferredError) => void,
        execution: TaskExecution<any>
      ): (arg0?: DeferredError) => void {
        return (reason?: DeferredError) => {
          if (!done) {
            done = true;
            execution.cancel();
            fn(reason);
          }
        };
      }

      function guardResolve<A>(
        fn: (arg0: A) => void,
        execution: TaskExecution<any>
      ): (arg0: A) => void {
        return (value: A) => {
          if (!done) {
            done = true;
            execution.cancel();
            fn(value);
          }
        };
      }

      leftExecution.listen({
        onRejected: guardRejection(resolver.reject, rightExecution),
        onCancelled: guardRejection(resolver.cancel, rightExecution),
        onResolved: guardResolve<T>(resolver.resolve, rightExecution),
      });
      rightExecution.listen({
        onRejected: guardRejection(resolver.reject, leftExecution),
        onCancelled: guardRejection(resolver.cancel, leftExecution),
        onResolved: guardResolve<T2>(resolver.resolve, leftExecution),
      });
    });
  }

  static waitAll2<A, B>(a: Task<A>, b: Task<B>): Task<[A, B]> {
    return Task.and<A, B>(a, b);
  }

  static waitAll3<A, B, C>(
    a: Task<A>,
    b: Task<B>,
    c: Task<C>
  ): Task<(A | B | C)[]> {
    return Task.and<A, [B, C]>(a, Task.and<B, C>(b, c)).map((res) => {
      const results = [];

      if (res && res[0]) {
        results.push(res[0]);
      }
      if (res && res[1]) {
        if (res[1][0]) {
          results.push(res[1][0]);
        }
        if (res[1][1]) {
          results.push(res[1][1]);
        }
      }

      return results;
    });
  }

  static waitAll4<A, B, C, D>(
    a: Task<A>,
    b: Task<B>,
    c: Task<C>,
    d: Task<D>
  ): Task<(A | B | C | D)[]> {
    return Task.waitAll2<[A, B], [C, D]>(
      Task.waitAll2<A, B>(a, b),
      Task.waitAll2<C, D>(c, d)
    ).map((res) => {
      const results = [];

      if (res && res[0]) {
        if (res[0][0]) {
          results.push(res[0][0]);
        }
        if (res[0][1]) {
          results.push(res[0][1]);
        }
      }
      if (res && res[1]) {
        if (res[1][0]) {
          results.push(res[1][0]);
        }
        if (res[1][1]) {
          results.push(res[1][1]);
        }
      }

      return results;
    });
  }
}

export function task<T>(computation: TaskComputation<T>): Task<T> {
  return new Task<T>(computation);
}

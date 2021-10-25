import {
  task,
  Task,
  TaskExecution,
  TaskComputation,
  DeferredError,
} from './index';

describe('Task', () => {
  describe('instantiation', () => {
    test('new Task<T>(TaskComputation<T>) -> Task<T>', () => {
      // Given
      const resultValue = 'value';
      const computation: TaskComputation<string> = ({ resolve }) => {
        return resolve(resultValue);
      };

      // When
      const result = new Task<string>(computation);

      // Then
      expect(result).toBeInstanceOf(Task);
    });
    test('Task.of<T>(value?:T) -> Task?resolved', () => {
      // Given
      const value = 'value';

      // When
      const result = Task.of<string>(value);

      // Then
      expect(result).toBeInstanceOf(Task);
    });
    test('Task.rejected<E, T>(reason?:E) -> Task?rejected', () => {
      // Given
      const reason: DeferredError = 'Something happened';

      // When
      const result = Task.rejected<string>(reason);

      // Then
      expect(result).toBeInstanceOf(Task);
    });
    test('task(computation) -> Task', () => {
      // Given
      const value = 'value';
      const computation: TaskComputation<string> = ({ resolve }) =>
        resolve(value);

      // When
      const result = task(computation);

      // Then
      expect(result).toBeInstanceOf(Task);
    });
  });
  describe('execution', () => {
    test('Task<T>.run() -> TaskExecution<T>', () => {
      // Given
      const resultValue = 'value';
      const computation: TaskComputation<string> = jest.fn(({ resolve }) => {
        return resolve(resultValue);
      });

      // When
      const result = new Task<string>(computation).run();

      // Then
      expect(result).toBeInstanceOf(TaskExecution);
      expect(computation).toHaveBeenCalled();
    });
    test('Task<T>.run().promise() -> Promise<T>', () => {
      // Given
      const resultValue = 'value';
      const computation: TaskComputation<string> = jest.fn(({ resolve }) => {
        return resolve(resultValue);
      });

      // When
      const result = new Task<string>(computation).run().promise();

      // Then
      expect(result).toBeInstanceOf(Promise);
      expect(computation).toHaveBeenCalled();
    });
  });
  describe('composition:andThen', () => {
    test('Task<A>.andThen<B>((A) -> Task<B>) -> Task<B>', () => {
      // Given
      const value = 'value';
      const computationOne: TaskComputation<string> = jest.fn(({ resolve }) =>
        resolve(value)
      );
      const transformation: (value?: string) => Task<string> = jest.fn(
        (value) => new Task(computationTwo(value))
      );
      const computationTwo: (value?: string) => TaskComputation<string> =
        jest.fn(
          (value) =>
            ({ resolve }) =>
              resolve(`${value}${value}`)
        );

      // When
      const result = new Task<string>(computationOne)
        .andThen<string>(transformation)
        .run();

      // Then
      expect(result).toBeInstanceOf(TaskExecution);
      expect(computationOne).toHaveBeenCalled();
      expect(transformation).toHaveBeenCalled();
      expect(computationTwo).toHaveBeenCalled();
    });
    test('Task<A>.andThen<B>((A) -> Task<B>?Throws) -> Task?rejected', () => {
      // Given
      const value = 'value';
      const err = 'Bad Idea';
      const computationOne: TaskComputation<string> = jest.fn(({ resolve }) =>
        resolve(value)
      );
      const transformation: (value?: string) => Task<string> = jest.fn(
        (_value) => {
          throw new Error(err);
        }
      );

      // When
      return expect(
        new Task<string>(computationOne)
          .andThen<string>(transformation)
          .run()
          .promise()
      ).rejects.toThrow(err);
    });
  });

  describe('composition:map', () => {
    test('Task<A>.map<B>((A) -> B) -> Task<B>', () => {
      // Given
      const value = 'value';
      const computationOne: TaskComputation<string> = jest.fn(({ resolve }) =>
        resolve(value)
      );
      const transformation: (value?: string) => number = jest.fn((value) =>
        value ? value.length : 0
      );

      // When
      const t = new Task<string>(computationOne).map<number>(transformation);

      expect(t).toBeInstanceOf(Task);

      const result = t.run();

      // Then
      expect(result).toBeInstanceOf(TaskExecution);
      expect(computationOne).toHaveBeenCalled();
      expect(transformation).toHaveBeenCalled();
    });
    test('Task<A>.map<B>((A) -> B?Throws) -> Task?rejected', () => {
      // Given
      const value = 'value';
      const err = 'Bad Idea';
      const computationOne: TaskComputation<string> = jest.fn(({ resolve }) =>
        resolve(value)
      );
      const transformation: (value: string) => number = jest.fn((value) => {
        throw new Error(err);
        return value.length;
      });

      // When
      const t = new Task<string>(computationOne).map<number>(transformation);

      expect(t).toBeInstanceOf(Task);

      return expect(t.run().promise()).rejects.toThrow(err);
    });
  });
  describe('composition:orElse', () => {
    test('Task.orElse()', () => {
      // Given
      const err = 'Something happened';
      const computation: TaskComputation<string> = jest.fn(({ reject }) =>
        reject(err)
      );
      const computationTwo: (
        reason?: DeferredError
      ) => TaskComputation<string> = jest.fn(
        (reason) =>
          ({ reject }) =>
            reject(reason)
      );
      const handler: (reason?: DeferredError) => Task<string> = jest.fn(
        (reason) => new Task<string>(computationTwo(reason))
      );

      // When
      const t = new Task<string>(computation).orElse(handler);
      expect(t).toBeInstanceOf(Task);

      const result = t.run();

      // Then
      expect(result).toBeInstanceOf(TaskExecution);
      expect(computation).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledWith(err);
    });
  });

  describe('concurrency', () => {
    describe('Task.and', () => {
      test('Task.and(Task)', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => resolve(right));
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.and<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return result.promise().then((res) => {
          expect(res).toBeInstanceOf(Array);
          expect(res[0]).toEqual(left);
          expect(res[1]).toEqual(right);
        });
      });
      test('Task.and(Task, Task?err) -> Task?rejected', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const errMessage = 'Bad Request';
        const rightComputation = jest.fn(({ reject }) =>
          reject(new Error(errMessage))
        );
        const rightTask = new Task<string>(rightComputation);

        const postProcessor = jest.fn((a) => a);

        // When
        const combined = Task.and<string, string>(leftTask, rightTask).map(
          postProcessor
        );

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();
        expect(postProcessor).not.toHaveBeenCalled();

        return expect(result.promise()).rejects.toThrow(errMessage);
      });

      test('Task.waitAll2(Task, Task)', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => resolve(right));
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.waitAll2<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return result.promise().then((res) => {
          expect(res).toEqual([left, right]);
        });
      });
      test('Task.waitAll3(Task, Task, Task)', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const middle = 'middle';
        const middleComputation = jest.fn(({ resolve }) => resolve(middle));
        const middleTask = new Task<string>(middleComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => resolve(right));
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.waitAll3<string, string, string>(
          leftTask,
          middleTask,
          rightTask
        );

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined
          .map((res) => {
            expect(res).toEqual([left, middle, right]);
          })
          .run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(middleComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();
      });
      test('Task.waitAll4(Task, Task, Task, Task)', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const middleLeft = 'middleLeft';
        const middleLeftComputation = jest.fn(({ resolve }) =>
          resolve(middleLeft)
        );
        const middleLeftTask = new Task<string>(middleLeftComputation);

        const middleRight = 'middleRight';
        const middleRightComputation = jest.fn(({ resolve }) =>
          resolve(middleRight)
        );
        const middleRightTask = new Task<string>(middleRightComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => resolve(right));
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.waitAll4<string, string, string, string>(
          leftTask,
          middleLeftTask,
          middleRightTask,
          rightTask
        );

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined
          .map<string[]>((res) => {
            expect(res).toEqual([left, middleLeft, middleRight, right]);

            return res;
          })
          .run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(middleLeftComputation).toHaveBeenCalled();
        expect(middleRightComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();
      });
    });
    describe('Task.or', () => {
      test('(Task?slow, Task?fast) -> Task.resolved?fast', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => {
          setTimeout(() => resolve(left), 1000);
        });
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => resolve(right));
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.or<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return result.promise().then((res) => {
          expect(res).toEqual(right);
        });
      });
      test('(Task?fast, Task?slow) -> Task.resolved?fast', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => resolve(left));
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => {
          setTimeout(() => resolve(right), 1000);
        });
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.or<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return result.promise().then((res) => {
          expect(res).toEqual(left);
        });
      });
      test('(Task?err, Task?slow) -> Task.rejected', () => {
        // Given
        const left = 'left';
        const errMessage = 'Bad Request';
        const leftComputation = jest.fn(({ reject }) =>
          reject(new Error(errMessage))
        );
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const rightComputation = jest.fn(({ resolve }) => {
          setTimeout(() => resolve(right), 1000);
        });
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.or<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return expect(result.promise()).rejects.toThrow(errMessage);
      });
      test('(Task?slow, Task?err) -> Task.rejected', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => {
          setTimeout(() => resolve(left), 1000);
        });
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const errMessage = 'Bad Request';
        const rightComputation = jest.fn(({ reject }) =>
          reject(new Error(errMessage))
        );
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.or<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return expect(result.promise()).rejects.toThrow(errMessage);
      });
      test('(Task?fast, Task?err?slow) -> Task.resolved?fast', () => {
        // Given
        const left = 'left';
        const leftComputation = jest.fn(({ resolve }) => {
          setTimeout(() => resolve(left), 100);
        });
        const leftTask = new Task<string>(leftComputation);

        const right = 'right';
        const errMessage = 'Bad Request';
        const rightComputation = jest.fn(({ reject }) => {
          setTimeout(() => reject(new Error(errMessage)), 1000);
        });
        const rightTask = new Task<string>(rightComputation);

        // When
        const combined = Task.or<string, string>(leftTask, rightTask);

        // Then
        expect(combined).toBeInstanceOf(Task);

        const result = combined.run();

        expect(result).toBeInstanceOf(TaskExecution);
        expect(leftComputation).toHaveBeenCalled();
        expect(rightComputation).toHaveBeenCalled();

        return expect(result.promise()).resolves.toEqual(left);
      });
    });
  });
});

describe('TaskExecution', () => {
  test('TaskExecution.cancel()', () => {
    // Given
    const cancelledHandler: () => void = jest.fn();
    const computation: TaskComputation<string> = jest.fn(
      ({ resolve, onCancelled }) => {
        onCancelled(cancelledHandler);

        setTimeout(() => resolve('done'), 1000);
      }
    );

    // When
    const result = new Task<string>(computation).run();

    result.cancel();

    // Then
    expect(result).toBeInstanceOf(TaskExecution);
    expect(cancelledHandler).toHaveBeenCalled();
  });
});

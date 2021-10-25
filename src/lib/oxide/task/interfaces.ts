/* istanbul ignore file */
import { EXECUTION_STATE } from './execution-state';

export type NoOp = () => void;

export type DeferredError = string | Error | undefined;

export interface ITaskResolver<T> {
  resolve: (value: T) => void;
  reject: (reason: DeferredError) => void;
  cancel: NoOp;
  cleanup: (arg0: NoOp) => void;
  onCancelled: (arg0: NoOp) => void;
  isCancelled: boolean;
}

export interface IDeferredListener<T> {
  onCancelled?: () => void;
  onRejected?: (arg0: DeferredError) => void;
  onResolved?: (arg0: T) => void;
}

export interface IDeferredState<T> {
  state: EXECUTION_STATE;
  reason?: DeferredError;
  value?: T;
}

export interface IDeferred<T> {
  _state: IDeferredState<T>;
  _listeners: IDeferredListener<T>[];
  promise: () => Promise<T>;
  listen: (pattern: IDeferredListener<T>) => IDeferred<T>;
  cancel: () => IDeferred<T>;
  maybeCancel: () => IDeferred<T>;
}

export type TaskComputation<T> = (arg0: ITaskResolver<T>) => void;

export interface ITaskExecution<T> {
  _task: ITask<T>;
  _deferred: IDeferred<T>;
  _links: ITaskExecution<any>[];
  cancel: () => ITaskExecution<T>;
  listen: (pattern: IDeferredListener<T>) => ITaskExecution<T>;
  promise: () => Promise<T>;
  link: (arg0: ITaskExecution<any>) => ITaskExecution<T>;
}

export interface ITask<T> {
  _computation: TaskComputation<T>;
}

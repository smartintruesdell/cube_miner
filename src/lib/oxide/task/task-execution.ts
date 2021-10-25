/**
 * @fileOverview
 * @name task-execution.ts
 * @description The TaskExecution class to handle resolving tasks
 * @authors
 *   Shawn Martin-Truesdell <shawn@masyc.com>
 * @copyright
 *   THIS SOFTWARE IS THE PROPERTY OF THE MASYC GROUP, INC. AND IS
 *   PROTECTED UNDER THE COPYRIGHT, TRADE SECRET, AND PROPRIETARY LAWS
 *   OF THE UNITED STATES AND, WHEN APPLICABLE, THE STATE OF CALIFORNIA
 */
import {
  IDeferred,
  IDeferredListener,
  ITask,
  ITaskExecution,
} from './interfaces';

export class TaskExecution<T> implements ITaskExecution<T> {
  _task: ITask<T>;
  _deferred: IDeferred<T>;
  _links: ITaskExecution<any>[];

  constructor(task: ITask<T>, deferred: IDeferred<T>) {
    this._task = task;
    this._deferred = deferred;
    this._links = [];
  }

  cancel(): TaskExecution<T> {
    this._deferred.maybeCancel();
    this._links.forEach((link) => link.cancel());

    return this;
  }

  listen(pattern: IDeferredListener<T>): TaskExecution<T> {
    this._deferred.listen(pattern);

    return this;
  }

  promise(): Promise<T> {
    return this._deferred.promise();
  }

  link(execution: TaskExecution<any>): TaskExecution<T> {
    this._links.push(execution);
    return this;
  }
}

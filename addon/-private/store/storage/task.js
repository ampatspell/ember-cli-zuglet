import EmberObject from '@ember/object';
import firebase from "firebase/app";
import { objectToJSON } from '../../util/object-to-json';
import { tracked } from '@glimmer/tracking';
import { toJSON } from '../../util/to-json';

const {
  STATE_CHANGED
} = firebase.storage.TaskEvent;

export default class StorageTask extends EmberObject {

  @tracked metadata
  @tracked total = null
  @tracked transferred = null;
  @tracked isRunning = true;
  @tracked isCompleted = false;
  @tracked isError = false;
  @tracked error = null;

  init() {
    super.init(...arguments);
    this._await(this._task);
  }

  get progress() {
    let { total, transferred } = this;
    if(total === null || transferred === null) {
      return 0;
    }
    return Math.floor(transferred / total * 100);
  }

  async _await(task) {
    let snapshot;
    try {
      snapshot = await task;
    } catch {
      return;
    }
    this._onSnapshot(snapshot);
  }

  _onSnapshot(snapshot) {
    let { metadata, bytesTransferred, totalBytes } = snapshot;
    this.metadata = metadata;
    this.transferred = bytesTransferred;
    this.total = totalBytes;
  }

  _onError(error) {
    this.isRunning = false;
    this.isError = true;
    this.error = error;
  }

  _onCompleted() {
    this.isRunning = false;
    this.isCompleted = true;
    this._cancelObserver();
  }

  get promise() {
    return Promise.resolve(this._task).then(() => this);
  }

  //

  _cancelObserver() {
    if(this._taskObserver) {
      this._taskObserver();
      this._taskObserver = null;
    }
  }

  onActivated() {
    if(!this.isRunning) {
      return;
    }
    this._taskObserver = this._task.on(STATE_CHANGED,
      snapshot => this._onSnapshot(snapshot),
      err => this._onError(err),
      (...args) => this._onCompleted(args)
    );
  }

  onDeactivated() {
    this._cancelObserver();
  }

  //

  get serialized() {
    let { type, data, ref: { path }, transferred, total, progress, isRunning, isError, isCompleted, error, metadata } = this;
    return {
      type,
      data: objectToJSON(data),
      path,
      transferred,
      total,
      progress,
      isRunning,
      isError,
      isCompleted,
      error,
      metadata
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.ref.path}`;
  }

}

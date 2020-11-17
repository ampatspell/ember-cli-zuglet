import EmberObject from '@ember/object';
import firebase from "firebase/app";
import { objectToJSON } from '../../util/object-to-json';
import { tracked } from '@glimmer/tracking';
import { toJSON } from '../../util/to-json';
import { state, readable }  from '../../model/tracking/state';
import { registerOnSnapshot, registerPromise } from '../../stores/stats';

const {
  STATE_CHANGED
} = firebase.storage.TaskEvent;

export default class StorageTask extends EmberObject {

  @state _state
  @readable total = null
  @readable transferred = null;
  @readable isRunning = true;
  @readable isCompleted = false;
  @readable isError = false;
  @readable error = null;

  @tracked metadata

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
      snapshot = await registerPromise(this, 'task', task);
    } catch(err) {
      this._onError(err);
      return;
    }
    this._onSnapshot(snapshot);
  }

  _onSnapshot(snapshot) {
    let { metadata, bytesTransferred: transferred, totalBytes: total } = snapshot;
    this.metadata = metadata;
    this._state.setProperties({ transferred, total });
  }

  _onError(error) {
    this._state.setProperties({ isRunning: false, isError: true, error });
  }

  _onCompleted() {
    this._state.setProperties({ isRunning: false, isCompleted: true });
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
    let { isRunning } = this._state.untracked.getProperties('isRunning');
    if(!isRunning) {
      return;
    }
    this._taskObserver = registerOnSnapshot(this, this._task.on(STATE_CHANGED,
      snapshot => this._onSnapshot(snapshot),
      err => this._onError(err),
      (...args) => this._onCompleted(args)
    ));
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

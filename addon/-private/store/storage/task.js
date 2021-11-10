import firebase from "firebase/compat/app";
import ZugletObject from '../../../object';
import { objectToJSON } from '../../util/object-to-json';
import { tracked } from '@glimmer/tracking';
import { toJSON } from '../../util/to-json';
import { state, readable }  from '../../model/tracking/state';
import { registerObserver, registerPromise } from '../../stores/stats';

const {
  STATE_CHANGED
} = firebase.storage.TaskEvent;

const calculateProgress = (total, transferred) => {
  let value = transferred / total * 100;
  return Math.round((value + Number.EPSILON) * 10) / 10;
};

export default class StorageTask extends ZugletObject {

  @state _state;
  @readable total = null;
  @readable transferred = null;
  @readable isRunning = true;
  @readable isCompleted = false;
  @readable isError = false;
  @readable error = null;
  @readable progress = 0;

  @tracked metadata;

  constructor(owner, { ref, type, data, _task, metadata }) {
    super(owner);
    this.ref = ref;
    this.type = type;
    this.data = data;
    this._task = _task;
    this.metadata = metadata;
    this._await(_task);
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
    this._onCompleted();
  }

  _onSnapshot(snapshot) {
    let { metadata, bytesTransferred: transferred, totalBytes: total } = snapshot;
    this.metadata = this.ref._normalizeMetadata(metadata);
    let progress = calculateProgress(total, transferred);
    this._state.setProperties({ transferred, total, progress });
  }

  _onError(error) {
    this._state.setProperties({ isRunning: false, isError: true, error });
    this.ref.storage.store.onObserverError(this, error);
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
    this._taskObserver = registerObserver(this, wrap => {
      return this._task.on(STATE_CHANGED,
        wrap(snapshot => this._onSnapshot(snapshot)),
        wrap(err => this._onError(err)),
        wrap(() => this._onCompleted())
      )
    });
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

import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import setChangedProperties from '../../util/set-changed-properties';
import firebase from 'firebase';
import { resolve } from 'rsvp';
import actions from '../../util/actions';

const {
  STATE_CHANGED
} = firebase.storage.TaskEvent;

export default Internal.extend({

  ref: null,
  type: null,
  task: null,

  isCompleted: false,
  isRunning: not('isCompleted').readOnly(),
  isError: false,
  error: null,

  percent: computed('snapshot', function() {
    let snapshot = this.get('snapshot');
    if(!snapshot) {
      return 0;
    }
    let { bytesTransferred, totalBytes } = snapshot;
    return Math.floor(bytesTransferred / totalBytes * 100);
  }).readOnly(),

  createModel() {
    return this.ref.factoryFor('zuglet:storage/task').create({ _internal: this });
  },

  init() {
    this._super(...arguments);
    let task = this.get('task');
    this.promise = resolve(task);
    this.set('snapshot', task.snapshot);
    this.startObservingTask();
  },

  taskDidFinish() {
    this.stopObservingTask();
  },

  onSnapshot(snapshot) {
    this.set('snapshot', snapshot);
  },

  onError(error) {
    setChangedProperties(this, { isCompleted: true, isError: true, error });
    this.taskDidFinish();
  },

  onCompleted() {
    setChangedProperties(this, { isCompleted: true });
    this.ref.onTaskCompleted(this);
    this.taskDidFinish();
  },

  startObservingTask() {
    this._taskObserver = this.task.on(STATE_CHANGED,
      snapshot => actions(() => this.onSnapshot(snapshot)),
      err => actions(() => this.onError(err)),
      () => actions(() => this.onCompleted())
    );
  },

  stopObservingTask() {
    this._taskObserver && this._taskObserver();
  },

  willDestroy() {
    this.stopObservingTask();
    this._super(...arguments);
  },

});

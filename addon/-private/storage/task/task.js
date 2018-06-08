import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import ModelMixin from '../../internal/model-mixin';
import serialized from '../../util/serialized';

const snapshot = [
  // 'downloadURL',
  'bytesTransferred',
  'totalBytes'
];

let task = [
  'type',
  'percent',
  'isRunning',
  'isCompleted',
  'isError',
  'error'
];

const TaskPropertiesMixin = Mixin.create(task.reduce((hash, key) => {
  hash[key] = readOnly(`_internal.${key}`);
  return hash;
}, {}));

const SnapshotPropertiesMixin = Mixin.create(snapshot.reduce((hash, key) => {
  hash[key] = computed('_internal.snapshot', function() {
    let snapshot = this.get('_internal.snapshot');
    if(!snapshot) {
      return;
    }
    return snapshot[key];
  }).readOnly();
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, TaskPropertiesMixin, SnapshotPropertiesMixin, {

  reference: computed(function() {
    return this._internal.ref.model(true);
  }).readOnly(),

  serialized: serialized([ ...task, ...snapshot ]),

  promise: computed('_internal.promise', function() {
    return this.get('_internal.promise').then(() => this);
  }).readOnly(),

});

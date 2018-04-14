import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import serialized from '../../util/serialized';
import { invokeReturningModel, invokePromiseReturningThis } from '../../internal/invoke';

let ref = [
  'fullPath',
  'bucket',
  'name'
];

const RefPropertiesMixin = Mixin.create(ref.reduce((hash, key) => {
  hash[key] = computed('_internal.ref', function() {
    return this._internal.ref[key];
  }).readOnly();
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, RefPropertiesMixin, {

  parent: computed('_internal.parent', function() {
    let internal = this.get('_internal.parent');
    return internal && internal.model(true);
  }).readOnly(),

  metadata: computed('_internal.metadata', function() {
    let internal = this.get('_internal.metadata');
    return internal && internal.model(true);
  }).readOnly(),

  url: readOnly('metadata.downloadURL'),

  serialized: serialized(ref),

  // { optional }
  load: invokePromiseReturningThis('load'),

  // { type: 'data', data: ..., metadata: { } }
  // { type: 'string', data: ..., format: 'raw' / 'base64' / 'base64-url' / 'data-url', metadata: {} }
  put(opts) {
    return this._internal.put(opts).model(true);
  },

  child: invokeReturningModel('child')

});

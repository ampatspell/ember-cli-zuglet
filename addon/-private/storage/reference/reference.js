import EmberObject, { computed } from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import serialized from '../../util/serialized';

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

  metadata: computed('_internal.metadata', function() {
    let internal = this.get('_internal.metadata');
    return internal && internal.model(true);
  }).readOnly(),

  serialized: serialized(ref),

  load(opts) {
    return this._internal.load(opts);
  }

});

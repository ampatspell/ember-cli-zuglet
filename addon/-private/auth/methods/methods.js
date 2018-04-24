import EmberObject, { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';
import { types } from './internal';

const TypesMixin = Mixin.create(types.reduce((hash, key) => {
  hash[key] = computed(function() {
    return this._internal.method(key).model(true);
  }).readOnly();
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, TypesMixin, {

  available: readOnly('_internal.types')

});

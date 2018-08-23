import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import { state } from './internal';
import { invokePromiseReturningThis } from '../../../internal/invoke';

const StatePropertiesMixin = Mixin.create(state.reduce((hash, key) => {
  hash[key] = readOnly(`_internal.${key}`);
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, StatePropertiesMixin, {

  ref: computed(function() {
    return this._internal.ref.model(true);
  }).readOnly(),

  // { optional }
  load: invokePromiseReturningThis('load')

});

import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import { state } from './internal';

const StatePropertiesMixin = Mixin.create(state.reduce((hash, key) => {
  hash[key] = readOnly(`_internal.${key}`);
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, StatePropertiesMixin, {
});

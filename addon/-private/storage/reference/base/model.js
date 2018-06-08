import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../../internal/model-mixin';
import Mixin from '@ember/object/mixin';

export const makeStatePropertiesMixin = state => Mixin.create(state.reduce((hash, key) => {
  hash[key] = readOnly(`_internal.${key}`);
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, {
});

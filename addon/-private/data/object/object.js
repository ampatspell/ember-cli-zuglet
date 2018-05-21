import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';
import DataModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, DataModelMixin, {

  isDirty: readOnly('_internal.isDirty'),

  unknownProperty(key) {
    return this._internal.getModelValue(key);
  },

  setUnknownProperty(key, value) {
    return this._internal.setModelValue(key, value);
  }

});

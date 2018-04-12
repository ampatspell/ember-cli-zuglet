import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import MutableArray from '@ember/array/mutable';
import ModelMixin from '../../internal/model-mixin';
import DataModelMixin from '../internal/model-mixin';

export default EmberObject.extend(MutableArray, ModelMixin, DataModelMixin, {

  length: readOnly('_internal.content.values.length'),

  objectAt(idx) {
    return this._internal.getModelValue(idx);
  },

  replace(idx, amt, objects) {
    return this._internal.replaceModelValues(idx, amt, objects);
  }

});

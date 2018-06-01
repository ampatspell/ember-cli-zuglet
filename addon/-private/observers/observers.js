import EmberObject from '@ember/object';
import EmberArray from '@ember/array';
import ModelMixin from '../internal/model-mixin';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend(ModelMixin, EmberArray, {

  length: readOnly('_internal.observers.length'),

  objectAt(idx) {
    let internal = this._internal.get('observers').objectAt(idx);
    return internal && internal.model(true);
  },

  promise: readOnly('_internal.promise')

});

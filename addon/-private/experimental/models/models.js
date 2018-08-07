import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import EmberArray from '@ember/array';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, EmberArray, {

  length: readOnly('_internal.models.length'),

  objectAt(idx) {
    return this.get('_internal.models').objectAt(idx);
  }

});

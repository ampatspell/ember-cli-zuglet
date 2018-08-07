import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import EmberArray from '@ember/array';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, EmberArray, {

  length: readOnly('_internal.content.length'),

  objectAt(idx) {
    return this.get('_internal.content').objectAt(idx);
  }

});

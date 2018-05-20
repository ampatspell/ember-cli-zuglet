import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import DataModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, DataModelMixin, {

  // unknownProperty(key) {
  //   return this._internal.getModelValue(key);
  // },

  // setUnknownProperty(key, value) {
  //   return this._internal.setModelValue(key, value);
  // }

});

import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  region: readOnly('_internal.region'),

  callable(name) {
    return this._internal.callable(name).model(true);
  },

  toStringExtension() {
    return this.get('region');
  }

});

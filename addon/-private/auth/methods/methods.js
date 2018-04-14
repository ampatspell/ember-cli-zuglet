import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  available: readOnly('_internal.types'),

  unknownProperty(key) {
    let method = this._internal.method(key);
    return method && method.model(true);
  }

});

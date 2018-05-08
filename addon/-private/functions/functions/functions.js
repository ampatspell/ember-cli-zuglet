import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  callable(name) {
    return this._internal.callable(name).model(true);
  }

});
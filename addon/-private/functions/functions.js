import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  call() {
    return this._internal.call(...arguments);
  }

});
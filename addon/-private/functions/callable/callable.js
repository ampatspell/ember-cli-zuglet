import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  call(opts) {
    return this._internal.call(opts);
  }

});

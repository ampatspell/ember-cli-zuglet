import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend(ModelMixin, {

  isCancelled: readOnly('_internal.isCancelled'),
  promise: readOnly('_internal.promise'),

  load() {
    return this._internal.load();
  },

  cancel() {
    return this._internal.cancel();
  }

});

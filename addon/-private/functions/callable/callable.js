import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  name: readOnly('_internal.name'),

  functions: computed(function() {
    return this._internal.functions.model(true);
  }).readOnly(),

  call(opts) {
    return this._internal.call(opts);
  }

});

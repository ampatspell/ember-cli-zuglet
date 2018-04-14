import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend(ModelMixin, {

  tasks: readOnly('_internal.tasks'),

  ref(opts) {
    return this._internal.createInternalReferenceWithOptions(opts).model(true);
  }

});

import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from './model-mixin';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  query(fn) {
    return this._internal.createInternalQuery(fn).model(true);
  }

});

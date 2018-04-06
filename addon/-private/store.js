import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from './model-mixin';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  ready: computed(function() {
    return this.get('_internal.ready').then(() => this);
  }).readOnly(),

  query(fn) {
    return this._internal.createInternalQuery(fn).model(true);
  }

});

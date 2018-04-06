import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from './model-mixin';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  ready: computed(function() {
    return this.get('_internal.ready').then(() => this);
  }).readOnly(),

  collection(path) {
    return this._internal.createInternalCollectionReference(path).model(true);
  },

  doc(path) {
    return this._internal.createInternalDocumentReference(path).model(true);
  },

  query(fn) {
    return this._internal.createInternalQuery(fn).model(true);
  },

  load(opts) {
    return this._internal.load(opts);
  }

});

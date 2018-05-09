import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../internal/model-mixin';
import { invokeReturningModel, invokePromiseReturningModel } from '../internal/invoke';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  ready: computed(function() {
    return this.get('_internal.ready').then(() => this);
  }).readOnly(),

  auth: computed(function() {
    return this.get('_internal.auth').model(true);
  }).readOnly(),

  storage: computed(function() {
    return this.get('_internal.storage').model(true);
  }).readOnly(),

  functions: computed(function() {
    return this.get('_internal.functions').model(true);
  }).readOnly(),

  observed: readOnly('_internal.observedProxy'),

  collection: invokeReturningModel('collection'),
  doc: invokeReturningModel('doc'),

  object: invokeReturningModel('object'),
  array: invokeReturningModel('array'),
  serverTimestamp: invokeReturningModel('serverTimestamp'),

  settle: invokePromiseReturningModel('settle'),

  restore() {},

  restoreUser() {},

  find(...args) {
    console.warn(`ember-cli-zuglet: store.find([ ${args.join(', ')} ])`);
  }

});

import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../internal/model-mixin';
import { invoke, invokeReturningModel, invokePromiseReturningModel, invokePromiseReturningThis } from '../internal/invoke';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  ready: computed(function() {
    return this.get('_internal.ready').then(() => this);
  }).readOnly(),

  models: computed(function() {
    return this.get('_internal.models').model(true);
  }).readOnly(),

  auth: computed(function() {
    return this.get('_internal.auth').model(true);
  }).readOnly(),

  storage: computed(function() {
    return this.get('_internal.storage').model(true);
  }).readOnly(),

  functions(region) {
    return this._internal.functions(region).model(true);
  },

  observed: readOnly('_internal.observedProxy'),

  collection: invokeReturningModel('collection'),
  doc: invokeReturningModel('doc'),

  object: invokeReturningModel('object'),
  array: invokeReturningModel('array'),
  serverTimestamp: invokeReturningModel('serverTimestamp'),

  transaction: invokePromiseReturningThis('transaction'),
  batch: invoke('batch'),

  settle: invokePromiseReturningModel('settle'),

  restore() {},

  restoreUser() {},

  onError() {}, // document & query errors

  find(...args) {
    let string = args.map(arg => typeof arg === 'string' ? `"${arg}"` : arg).join(', ');
    console.warn(`ember-cli-zuglet: store.find(${string})`);
  },

});

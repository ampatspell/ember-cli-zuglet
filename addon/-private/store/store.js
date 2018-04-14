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

  observed: readOnly('_internal.observedProxy'),

  collection: invokeReturningModel('collection'),
  doc: invokeReturningModel('doc'),

  object: invokeReturningModel('object'),
  array: invokeReturningModel('array'),

  settle: invokePromiseReturningModel('settle')

});

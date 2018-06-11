import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import ModelMixin from '../internal/model-mixin';
import { invokeReturningModel, invokePromiseReturningThis } from '../internal/invoke';

export default EmberObject.extend(ModelMixin, {

  init() {
    this._super(...arguments);
    this._internal = getOwner(this).factoryFor('zuglet:stores/internal').create({ _model: this });
    console.log('init', this+'');
  },

  ready: computed('_internal.stores.[]', function() {
    return this._internal.ready();
  }).readOnly(),

  createStore: invokeReturningModel('createStore'),

  settle: invokePromiseReturningThis('settle'),

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  }

});

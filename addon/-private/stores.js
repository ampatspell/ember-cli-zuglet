import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import ModelMixin from './model-mixin';
import { invokeReturningModel } from './util/internal-invoke';

export default EmberObject.extend(ModelMixin, {

  init() {
    this._super(...arguments);
    this._internal = getOwner(this).factoryFor('zuglet:stores/internal').create({ _model: this });
  },

  ready: computed('_internal.stores.[]', function() {
    return this._internal.ready();
  }).readOnly(),

  createStore: invokeReturningModel('createStore')

});
import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import ModelMixin from './model-mixin';

export default EmberObject.extend(ModelMixin, {

  init() {
    this._super(...arguments);
    this._internal = getOwner(this).factoryFor('zuglet:stores/internal').create({ _model: this });
  },

  createStore(identifier, factory) {
    return this._internal.createStore(identifier, factory).model(true);
  }

});
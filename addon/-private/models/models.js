import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  registerFactory(name, factory) {
    return this._internal.registerFactory(name, factory);
  },

  hasFactoryFor(name) {
    return this._internal.hasFactoryFor(name);
  },

  factoryFor(name, opts) {
    return this._internal.factoryFor(name, opts);
  },

  create(name, props) {
    return this._internal.create(name, props);
  }

});

import Internal from '../internal/internal';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { dasherize } from '@ember/string';

export default Internal.extend({

  store: null,

  createModel() {
    return this.store.factoryFor('zuglet:models').create({ _internal: this });
  },

  normalizedModelName(name) {
    assert(`model name is required`, !!name);
    assert(`model name must be string`, typeof name === 'string');
    return dasherize(name);
  },

  modelFullNameForNormalizedName(name) {
    return `model:${name}`;
  },

  registerFactory(name, factory) {
    let normalizedName = this.normalizedModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    getOwner(this).register(fullName, factory);
  },

  hasFactoryFor(name) {
    return !!this.factoryFor(name, { optional: true });
  },

  factoryFor(name, opts={}) {
    let { optional } = opts;
    let normalizedName = this.normalizedModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    let factory = this.store.factoryFor(fullName);
    assert(`model '${normalizedName}' is not registered`, optional || !!factory);
    return factory;
  },

  create(name, props) {
    let factory = this.factoryFor(name);
    return factory.create(props);
  }

});

import EmberObject from '@ember/object';
import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';
import { getOwner } from '../util/get-owner';

export default class Models extends EmberObject {

  normalizeModelName(name) {
    assert(`model name is required`, !!name);
    assert(`model name must be string`, typeof name === 'string');
    return dasherize(name);
  }

  modelFullNameForNormalizedName(name) {
    return `model:${name}`;
  }

  registerFactory(name, factory) {
    let normalizedName = this.normalizeModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    getOwner(this).register(fullName, factory);
  }

  factoryFor(name, opts={}) {
    let { optional } = opts;
    let normalizedName = this.normalizeModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    let factory = getOwner(this).factoryFor(fullName);
    assert(`model '${normalizedName}' is not registered`, optional || !!factory);
    return factory;
  }

  hasFactoryFor(name) {
    return !!this.factoryFor(name, { optional: true });
  }

  create(name, props) {
    let factory = this.factoryFor(name);
    return factory.create(props);
  }

}

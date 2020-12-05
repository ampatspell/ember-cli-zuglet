import EmberObject from '@ember/object';
import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';
import { getOwner } from '../util/get-owner';
import { isFunction } from '../util/object-to-json';
import { getState } from '../model/state';
import { cached } from '../model/decorators/cached';

const {
  assign
} = Object;

export default class Models extends EmberObject {

  @cached()
  get _modulePrefix() {
    return getOwner(this).application?.modulePrefix;
  }

  _fullNameWithModulePrefix(fullName) {
    let prefix = this._modulePrefix;
    if(prefix) {
      return `${prefix}@${fullName}`;
    }
    return fullName;
  }

  normalizeModelName(name) {
    assert(`model name is required`, !!name);
    assert(`model name must be string`, typeof name === 'string');
    return dasherize(name);
  }

  modelFullNameForNormalizedName(name) {
    return `model:${name}`;
  }

  registerFactory(name, factory) {
    assert(`factory is required`, !!factory);
    let normalizedName = this.normalizeModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    getOwner(this).register(fullName, factory);
  }

  _factoryFor(normalizedName, fullName, opts) {
    let { optional } = assign({ optional: false }, opts);
    let factory = getOwner(this).factoryFor(fullName);
    assert(`model '${normalizedName}' is not registered`, optional || !!factory);
    return factory;
  }

  factoryFor(name, opts) {
    let normalizedName = this.normalizeModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    return this._factoryFor(normalizedName, fullName, opts);
  }

  hasFactoryFor(name) {
    return !!this.factoryFor(name, { optional: true });
  }

  create(name, ...args) {
    let normalizedName = this.normalizeModelName(name);
    let fullName = this.modelFullNameForNormalizedName(normalizedName);
    let factory = this._factoryFor(normalizedName, fullName, { optional: false });

    // classic
    if(isFunction(factory.class.create)) {
      return factory.create(...args);
    }

    // native
    let instance = new factory.class(getOwner(this), ...args);
    getState(instance).modelName = this._fullNameWithModulePrefix(fullName);
    return instance;
  }

}

import EmberObject from '@ember/object';
import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';
import { getOwner } from '../util/get-owner';
import { isFunction } from '../util/types';
import { getState } from '../model/state';
import { cached } from '../model/decorators/cached';

const {
  assign
} = Object;

export default class Factory extends EmberObject {

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

  _normalizeModelName(name) {
    assert(`model name is required`, !!name);
    assert(`model name must be string`, typeof name === 'string');
    return dasherize(name);
  }

  _modelFullNameForNormalizedName(prefix, name) {
    assert(`prefix is required`, !!prefix);
    return `${prefix}:${name}`;
  }

  registerFactory(prefix, name, factory) {
    assert(`factory is required`, !!factory);
    let normalizedName = this._normalizeModelName(name);
    let fullName = this._modelFullNameForNormalizedName(prefix, normalizedName);
    getOwner(this).register(fullName, factory);
  }

  _factoryFor(prefix, normalizedName, opts) {
    let { optional } = assign({ optional: false }, opts);
    let fullName = this._modelFullNameForNormalizedName(prefix, normalizedName);
    let factory = getOwner(this).factoryFor(fullName);
    assert(`model '${normalizedName}' is not registered`, optional || !!factory);
    let isClassic;
    let create;
    if(factory) {
      isClassic = isFunction(factory.class.create);
      create = (...args) => {
        if(isClassic) {
          return factory.create(...args);
        }
        let instance = new factory.class(getOwner(this), ...args);
        getState(instance).modelName = this._fullNameWithModulePrefix(fullName);
        return instance;
      };
    }
    return {
      factory,
      fullName,
      isClassic,
      create
    };
  }

  factoryFor(prefix, name, opts) {
    let normalizedName = this._normalizeModelName(name);
    let { factory } = this._factoryFor(prefix, normalizedName, opts);
    return factory
  }

  hasFactoryFor(prefix, name) {
    return !!this.factoryFor(prefix, name, { optional: true });
  }

  create(prefix, name, ...args) {
    let normalizedName = this._normalizeModelName(name);
    let { create } = this._factoryFor(prefix, normalizedName, { optional: false });
    return create(...args);
  }

  @cached()
  get models() {
    let factory = this;
    return getOwner(this).factoryFor('zuglet:stores/factory/models').create({ factory });
  }

  @cached()
  get zuglet() {
    let factory = this;
    return getOwner(this).factoryFor('zuglet:stores/factory/zuglet').create({ factory });
  }

}

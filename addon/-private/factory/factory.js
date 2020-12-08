import ZugletObject from '../object';
import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';
import { getOwner } from '../util/get-owner';
import { isFunction } from '../util/types';
import { MODEL_NAME } from '../util/to-primitive';
import { cached } from '../model/decorators/cached';

const {
  assign
} = Object;

const factory = (_, key) => ({
  get() {
    let factory = this;
    return this.create('zuglet', `factory/${key}`, { factory });
  }
});

export default class Factory extends ZugletObject {

  static create(owner) {
    return new this(getOwner(owner));
  }

  //

  @cached()
  get _modulePrefix() {
    return getOwner(this).application?.modulePrefix;
  }

  _debugModelName(prefix, name, fullName) {
    if(prefix === 'zuglet') {
      return `${prefix}@${name}`;
    }
    return `${this._modulePrefix}@${fullName}`;
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

  _factoryFor(prefix, name, opts) {
    let { optional } = assign({ optional: false }, opts);
    let normalizedName = this._normalizeModelName(name);
    let fullName = this._modelFullNameForNormalizedName(prefix, normalizedName);
    let factory = getOwner(this).factoryFor(fullName);
    assert(`model '${normalizedName}' is not registered`, optional || !!factory);
    if(!factory) {
      return;
    }
    let isClassic = isFunction(factory.class.create);
    let create = (...args) => {
      if(isClassic) {
        return factory.create(...args);
      }
      let instance = new factory.class(getOwner(this), ...args);
      instance[MODEL_NAME] = this._debugModelName(prefix, normalizedName, fullName);
      return instance;
    };
    return {
      factory,
      fullName,
      isClassic,
      create
    };
  }

  factoryFor(prefix, name, opts) {
    return this._factoryFor(prefix, name, opts);
  }

  create(prefix, name, ...args) {
    let { create } = this._factoryFor(prefix, name, { optional: false });
    return create(...args);
  }

  //

  @cached()
  @factory
  models

  @cached()
  @factory
  zuglet

}

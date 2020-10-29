import Property, { property } from './property';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import ObjectActivator from './activate/object';
import ArrayActivator from './activate/array';
import { getPath } from '../../util/get-path';

export default class ActivateProperty extends Property {

  init() {
    super.init(...arguments);
    this.__deps = {};
  }

  //

  get providesValue() {
    return this.opts.providesValue;
  }

  get _deps() {
    let owner = this.owner;
    let keys = this.opts.deps;
    let deps = {};
    for(let key of keys) {
      let value = getPath(owner, key);
      deps[key] = value;
    }
    return deps;
  }

  _snapshotDeps() {
    this.__deps = this._deps;
    console.log('snapshot', this.__deps);
  }

  get _hasDepsChanged() {
    let current = this.__deps;
    let next = this._deps;
    for(let key in next) {
      if(current[key] !== next[key]) {
        console.log('deps changed', current, next);
        return true;
      }
    }
    console.log('deps hasnt changed', current);
    return false;
  }

  //

  get _value() {
    let value = this.opts.value;
    if(typeof value === 'function') {
      value = value.call(this.owner, this.owner);
    }
    return value;
  }

  _activatorTypeForValue(value) {
    if(isArray(value)) {
      return 'array';
    } else {
      return 'object';
    }
  }

  activatorTypeForValue(value) {
    let type = this._activatorTypeForValue(value);
    let { activator } = this;
    if(activator && value === null || value === undefined) {
      return activator.type;
    }
    return type;
  }

  createActivator(value) {
    if(isArray(value)) {
      return new ArrayActivator(this, value);
    }
    return new ObjectActivator(this, value);
  }

  _assertActivatorType(activator, value) {
    assert([
      `Changing activator type is not supported.`,
      `Now property '${this.key}' for ${this.owner} is of type ${activator.type}`,
      `but value '${value}' asks for activator of type ${this.activatorTypeForValue(value)}`
    ].join(' '), activator.type === this.activatorTypeForValue(value));
  }

  getPropertyValue() {
    let { activator } = this;
    if(this.providesValue) {
      if(!activator) {
        this._snapshotDeps();
        let value = this._value;
        activator = this.createActivator(value);
        this.activator = activator;
        return activator.getValue();
      } else {
        if(this._hasDepsChanged) {
          this._snapshotDeps();
          let value = this._value;
          this._assertActivatorType(activator, value);
          activator.setValue(value);
        }
        return activator.getValue();
      }
    } else {
      if(!activator) {
        return null;
      }
      return activator.getValue();
    }
  }

  // Only if providesValue === false
  setPropertyValue(value) {
    let { activator } = this;
    if(!activator) {
      activator = this.createActivator(value);
      this.activator = activator;
    } else {
      this._assertActivatorType(activator, value);
    }
    return activator.setValue(value);
  }

  //

  onActivated() {
    let { activator } = this;
    if(activator) {
      activator.activate();
    }
  }

  onDeactivated() {
    let { activator } = this;
    if(activator) {
      activator.deactivate();
    }
  }

}

let getProperty = (owner, key, opts) => property(owner, key, 'activate', opts);

const define = opts => (_, key) => {
  let get = function() {
    return getProperty(this, key, opts).getPropertyValue();
  }

  let set;
  if(!opts.providesContent) {
    set = function(value) {
      return getProperty(this, key, opts).setPropertyValue(value);
    }
  }

  return {
    get,
    set
  };
}

export const activate = () => {

  let opts = {
    providesValue: false,
    value: undefined
  };

  let extend = () => {
    let curr = define(opts);
    curr.content = (...args) => {
      let value = args.pop();
      opts.deps = args;
      opts.value = value;
      opts.providesValue = true;
      return extend();
    }
    return curr;
  }

  return extend();
}

import Property, { property } from './property';
import { getStores } from '../../stores/get-stores';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import ObjectActivator from './activate/activators/object';

export default class ModelProperty extends Property {

  _createModel() {
    let { owner, opts } = this;
    let modelName = opts.modelName.call(owner, owner);
    let props = opts.mapping.call(owner, owner);
    return getStores(this).models.create(modelName, props);
  }

  get _cache() {
    let cache = this.__cache;
    if(!cache) {
      cache = createCache(() => this._createModel());
      this.__cache = cache;
    }
    return cache;
  }

  get _value() {
    return getValue(this._cache);
  }

  _createActivator(value) {
    return new ObjectActivator(this, value);
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      let value = this._value;
      this.value = value;
      activator = this._createActivator(value);
      this.activator = activator;
    } else {
      let value = this._value;
      if(value !== this.value) {
        this.value = value;
        activator.setValue(value);
      }
    }
    return activator.getValue();
  }

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

const getProperty = (owner, key, opts) => property(owner, key, 'model', opts);

const define = props => (_, key) => {
  return {
    get() {
      return getProperty(this, key, props).getPropertyValue();
    }
  };
}

// @model().named((doc, owner) => 'animal').mapping(doc => ({ doc }))
export const model = () => {

  let opts = {
    modelName: null,
    mapping: null
  };

  let extend = () => {
    let curr = define(opts);
    curr.named = name => {
      if(typeof name !== 'function') {
        opts.modelName = () => name;
      } else {
        opts.modelName = name;
      }
      return extend();
    }
    curr.mapping = fn => {
      opts.mapping = fn;
      return extend();
    }
    return curr;
  }

  return extend();
}

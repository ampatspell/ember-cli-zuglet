import Property, { property } from './property';
import { A } from '@ember/array';
import { getState } from '../state';
import { getStores } from '../../stores/get-stores';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { assert } from '@ember/debug';

class Marker {

  constructor(source, modelName) {
    this.source = source;
    this._modelNameCache = createCache(modelName);
    this.modelName = this._modelName;
  }

  get _modelName() {
    return getValue(this._modelNameCache);
  }

  get hasModelNameChanged() {
    return this.modelName !== this._modelName;
  }

}

const marker = Symbol('MODELS');

const setMarker = (model, value) => {
  let state = getState(model);
  state[marker] = value;
}

const getMarker = model => {
  let state = getState(model);
  return state[marker];
}

export default class ModelsProperty extends Property {

  init() {
    super.init(...arguments);
    this.models = A([]);
    this.stores = getStores(this);
  }

  get _sourceCache() {
    assert(`@models().source(fn) is required and must be function`, typeof this.opts.source === 'function');
    let cache = this.__sourceCache;
    if(!cache) {
      cache = createCache(() => {
        let { owner, opts: { source } } = this;
        let value = source.call(owner, owner);
        return value ? A(value) : null;
      });
      this.__sourceCache = cache;
    }
    return cache;
  }

  get _source() {
    return getValue(this._sourceCache);
  }

  //

  createModel(source) {
    let { owner, opts } = this;
    assert(`@models().named(fn) is required and must be string or function`, typeof opts.modelName === 'function');
    assert(`@models().mapping(fn) is required and must be function`, typeof opts.mapping === 'function');
    let marker = new Marker(source, () => opts.modelName.call(owner, source, owner));
    let props = opts.mapping.call(owner, source, owner);
    let model = this.stores.models.create(marker.modelName, props);
    setMarker(model, marker);
    return model;
  }

  //

  sourceArrayDidChange(source) {
    let current = this.models;
    let removed = A([ ...current ]);
    let added = A();
    let models = A();

    if(source) {
      let find = doc => current.find(model => getMarker(model).source === doc);
      source.forEach(doc => {
        let model = find(doc);
        if(model) {
          let marker = getMarker(model);
          if(marker.hasModelNameChanged) {
            model = this.createModel(doc);
            added.pushObject(model);
          } else {
            removed.removeObject(model);
          }
        } else {
          model = this.createModel(doc);
          added.pushObject(model);
        }
        models.pushObject(model);
      });
    }

    if(this.isActivated) {
      this.deactivateValues(removed);
      this.activateValues(added);
    }

    this.models = models;
  }

  sourceDidChange() {
    let next = this._source;
    let current = this.source;
    this.sourceArrayDidChange(next);
    if(next !== current) {
      this.source = next;
    }
  }

  getPropertyValue() {
    this.sourceDidChange();
    return this.models;
  }

  //

  activateValues(models) {
    models.map(model => this.activateValue(model));
  }

  deactivateValues(models) {
    models.map(model => this.deactivateValue(model));
  }

  //

  onActivated() {
    this.activateValues(this.models);
  }

  onDeactivated() {
    this.deactivateValues(this.models);
  }

}

const getProperty = (owner, key, opts) => property(owner, key, 'models', opts);

const define = props => (_, key) => {
  return {
    get() {
      return getProperty(this, key, props).getPropertyValue();
    }
  };
}

// @models().source(({ query }) => query.content).named((doc, owner) => 'animal').mapping(doc => ({ doc }))
export const models = () => {

  let opts = {
    source: null,
    modelName: null,
    mapping: null
  };

  let extend = () => {
    let curr = define(opts);
    curr.source = source => {
      opts.source = source;
      return extend();
    }
    curr.named = name => {
      if(typeof name === 'function') {
        opts.modelName = name;
      } else {
        opts.modelName = () => name;
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

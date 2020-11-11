import Property, { property } from './property';
import { setOwner, getOwner } from '@ember/application';
import { A } from '@ember/array';
import { getState } from '../state';
import { getStores } from '../../stores/get-stores';
import { assert } from '@ember/debug';
import { diff, asObject, asString } from '../decorators/diff';

class Marker {

  @diff(asString)
  modelName() {
    let { owner, source, opts } = this;
    return opts.modelName.call(owner, source, owner);
  }

  @diff(asObject)
  props() {
    let { owner, source, opts } = this;
    return opts.mapping.call(owner, source, owner);
  }

  constructor(owner, source, opts) {
    setOwner(this, getOwner(owner));
    this.owner = owner;
    this.source = source;
    this.opts = opts;
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

  @diff()
  _source() {
    assert(`@models().source(fn) is required and must be function`, typeof this.opts.source === 'function');
    let { owner, opts } = this;
    let value = opts.source.call(owner, owner);
    return value ? A(value) : null;
  }

  //

  createModel(source) {
    let { owner, opts } = this;
    assert(`@models().named(fn) is required and must be string or function`, typeof opts.modelName === 'function');
    assert(`@models().mapping(fn) is required and must be function`, typeof opts.mapping === 'function');

    let marker = new Marker(owner, source, opts);

    let model = this.stores.models.create(marker.modelName.current, marker.props.current);
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
          if(marker.modelName.updated) {
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
    let {
      source: current,
      _source: { current: next }
    } = this;

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

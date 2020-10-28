import Property, { createProperty } from './property';
import { A } from '@ember/array';
import { getState } from '../state';
import { getStores } from '../../stores/get-stores';
import { getPath } from '../../util/get-path';

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

  get _source() {
    let { owner, opts: { sourceKey } } = this;
    let source = getPath(owner, sourceKey);
    if(!source) {
      return;
    }
    return A(source);
  }

  //

  modelNameForSource(source) {
    let { owner, opts: { resolveModelName } } = this;
    return resolveModelName.call(owner, source, owner);
  }

  createModel(source, modelName) {
    let { owner, opts: { mapping } } = this;
    let props = mapping.call(owner, source, owner);
    let model = this.stores.models.create(modelName, props);
    setMarker(model, {
      source,
      modelName
    });
    return model;
  }

  //

  sourceArrayDidChange(source) {
    source = A(source);

    let current = this.models;
    let removed = A([ ...current ]);
    let added = A();
    let models = A();

    let find = doc => current.find(model => {
      let marker = getMarker(model);
      return marker.source === doc;
    });

    let create = (doc, modelName) => this.createModel(doc, modelName);

    source.forEach(doc => {
      let model = find(doc);
      if(model) {
        let marker = getMarker(model);
        let modelName = this.modelNameForSource(doc);
        if(marker.modelName !== modelName) {
          model = create(doc, modelName);
          added.pushObject(model);
        } else {
          removed.removeObject(model);
        }
      } else {
        let modelName = this.modelNameForSource(doc);
        model = create(doc, modelName);
        added.pushObject(model);
      }
      models.pushObject(model);
    });

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

const normalizeResolveModelName = modelName => {
  if(typeof modelName === 'function') {
    return modelName;
  }
  return () => modelName;
}

// @models('query.content').named('animal').mapping(doc => ({ doc }))
export const models = sourceKey => {

  const getProperty = (owner, key, opts) => {
    return createProperty(owner, key, 'models', {
      owner,
      key,
      opts
    });
  }

  const property = props => (target, key, description) => {
    return {
      get() {
        return getProperty(this, key, props).getPropertyValue();
      }
    }
  }

  let opts = {
    sourceKey,
    resolveModelName: null,
    mapping: null
  };

  let extend = () => {
    let curr = property(opts);
    curr.named = name => {
      opts.resolveModelName = normalizeResolveModelName(name);
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

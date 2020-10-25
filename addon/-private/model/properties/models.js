import Property, { property } from './property';
import { get } from '@ember/object';
import { A } from '@ember/array';
import { getState } from '../state';
import { getStores } from '../../stores/get-stores';

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
    let source = get(owner, sourceKey);
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

const normalizeSourceDeps = (sourceKey, keys=[]) => {
  if(keys.length === 0) {
    return [];
  }
  return [ `${sourceKey}.@each.${keys.join(',')}` ];
}

const normalizeResolveModelName = modelName => {
  if(typeof modelName === 'function') {
    return modelName;
  }
  return () => modelName;
}

// @models('query.content').named('animal').mapping(doc => ({ doc })).object('data')
export const models = sourceKey => {
  let deps = [];

  const normalizeDeps = () => {
    return [
      `${sourceKey}.[]`,
      ...normalizeSourceDeps(sourceKey, deps)
    ];
  }

  let props = {
    readOnly: true,
    deps: normalizeDeps(),
    property: 'models',
    opts: {
      sourceKey,
      resolveModelName: null,
      mapping: null
    }
  };

  let extend = () => {
    let curr = property(props);
    curr.named = name => {
      props.opts.resolveModelName = normalizeResolveModelName(name);
      return extend();
    }
    curr.mapping = fn => {
      props.opts.mapping = fn;
      return extend();
    }
    curr.object = (...keys) => {
      deps = A([ ...deps, keys ]).uniq();
      props.deps = normalizeDeps();
      return extend();
    }
    return curr;
  }

  return extend();
}

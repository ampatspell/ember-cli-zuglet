import Property, { property } from './property';
import { setOwner, getOwner } from '@ember/application';
import { A, isArray } from '@ember/array';
import { getState } from '../state';
import { getFactory } from '../../factory/get-factory';
import { assert } from '@ember/debug';
import { diff, asObject, asString } from '../decorators/diff';
import { isFunction } from '../../util/types';
import { removeObject } from '../../util/array';

class Marker {

  @diff(asString)
  modelName() {
    let { owner, source, opts, key } = this;
    return opts.modelName.call(owner, source, owner, key);
  }

  @diff(asObject)
  props() {
    let { owner, source, opts, key } = this;
    return opts.mapping.call(owner, source, owner, key);
  }

  constructor(owner, source, opts, key) {
    setOwner(this, getOwner(owner));
    this.owner = owner;
    this.source = source;
    this.opts = opts;
    this.key = key;
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

  constructor() {
    super(...arguments);
    this.models = A([]);
    this.factory = getFactory(this).models;
  }

  @diff()
  _source() {
    assert(`@models().source(fn) is required`, !!this.opts.source);
    let { owner, opts } = this;
    let value = opts.source.call(owner, owner);
    return value ? A(value) : null;
  }

  //

  createModel(source) {
    let { owner, opts, key } = this;
    assert(`@models().named(fn) is required`, !!opts.modelName);
    assert(`@models().mapping(fn) is required`, !!opts.mapping);

    let marker = new Marker(owner, source, opts, key);

    let model = this.factory.create(marker.modelName.current, marker.props.current);
    setMarker(model, marker);

    return model;
  }

  registerLoad(model) {
    let { owner, opts: { load } } = this;
    if(!load) {
      return;
    }
    getState(model).setLoadOnActivated(() => load.call(model, model, owner));
  }

  //

  sourceArrayDidChange(source, markers) {
    let current = this.models;
    let removed = [ ...current ];
    let added = [];
    let models = A();

    if(isArray(source)) {
      let empty = {};
      let find = doc => {
        for(let model of current) {
          let marker;
          if(markers) {
            marker = markers.get(model);
          }
          if(!marker) {
            marker = getMarker(model);
          }
          if(marker.source === doc) {
            return {
              marker,
              model
            };
          }
        }
        return empty;
      }
      source.forEach(doc => {
        let { model, marker } = find(doc);
        if(model) {
          if(marker.modelName.updated) {
            model = this.createModel(doc);
            added.push(model);
            this.registerLoad(model);
          } else {
            let props = marker.props;
            if(props.updated) {
              if(isFunction(model.mappingDidChange)) {
                model.mappingDidChange.call(model, props.current);
                removeObject(removed, model);
                this.registerLoad(model);
              } else {
                model = this.createModel(doc);
                added.push(model);
                this.registerLoad(model);
              }
            } else {
              removeObject(removed, model);
            }
          }
        } else {
          model = this.createModel(doc);
          added.push(model);
          this.registerLoad(model);
        }
        models.push(model);
      });
    }

    let { isActivated } = this;

    if(isActivated) {
      this.deactivateValues(removed);
      this.activateValues(added);
    }

    this.models = models;
  }

  sourceArrayChanges(source) {
    let current = this.models;
    let changed = true;
    let replaced = false;
    let markers;

    if(isArray(source)) {
      let length = current.length;
      if(length === source.length) {
        for(let i = 0; i < length; i++) {
          let currentModel = current[i];
          let sourceDoc = source[i];
          let marker = getMarker(currentModel);
          if(marker.source === sourceDoc) {
            // TODO: not a greatest thing ever.
            // thing is, modelName and props.updated resets after get so it will need peek to clean up this mess
            let modelName = {
              updated: marker.modelName.updated
            };
            let props = {
              updated: marker.props.updated,
              current: marker.props.current
            }
            if(modelName.updated || props.updated) {
              if(!markers) {
                markers = new Map();
              }
              markers.set(currentModel, { modelName, props });
            }
          } else {
            // TODO: this could also create marker
            replaced = true;
          }
        }
        if(!markers && !replaced) {
          changed = false;
        }
      }
    }

    return {
      changed,
      markers
    };
  }

  sourceDidChange() {
    let {
      source: current,
      _source: { current: next }
    } = this;

    let { changed, markers } = this.sourceArrayChanges(next);
    if(changed) {
      this.sourceArrayDidChange(next, markers);
    }

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
    mapping: null,
    load: null
  };

  let extend = () => {
    let curr = define(opts);
    curr.source = source => {
      assert(`@models().source(fn) must be function not '${source}'`, isFunction(source));
      opts.source = source;
      return extend();
    }
    curr.named = name => {
      if(isFunction(name)) {
        opts.modelName = name;
      } else {
        opts.modelName = () => name;
      }
      return extend();
    }
    curr.mapping = fn => {
      assert(`@models().mapping(fn) must be function not '${fn}'`, isFunction(fn));
      opts.mapping = fn;
      return extend();
    }
    curr.load = fn => {
      assert(`@models().load(fn) must be function not '${fn}'`, isFunction(fn));
      opts.load = fn;
      return extend();
    }
    return curr;
  }

  return extend();
}

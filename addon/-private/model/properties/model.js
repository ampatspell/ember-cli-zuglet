import Property, { property } from './property';
import { getFactory } from '../../factory/get-factory';
import { getState } from '../state';
import ObjectActivator from './activate/activators/object';
import { diff, asOptionalString, asOptionalObject, asIdentity } from '../decorators/diff';
import { isFunction } from '../../util/types';
import { assert } from '@ember/debug';

export default class ModelProperty extends Property {

  @diff(asOptionalString)
  _modelName() {
    let { owner, opts, key } = this;
    return opts.modelName.call(owner, owner, key);
  }

  @diff(asOptionalObject)
  _props() {
    let { owner, opts, key } = this;
    if(opts.mapping) {
      return opts.mapping.call(owner, owner, key);
    }
  }

  registerLoad(model) {
    let { owner, opts: { load } } = this;
    if(!load) {
      return;
    }
    getState(model).setLoadOnActivated(() => load.call(model, model, owner));
  }

  @diff(asIdentity)
  _value(current) {
    let modelName = this._modelName;
    let props = this._props;

    let create = () => getFactory(this).models.create(modelName.current, props.current);

    if(current && !modelName.updated) {
      if(props.updated) {
        if(isFunction(current.mappingDidChange)) {
          current.mappingDidChange.call(current, props.current);
          this.registerLoad(current);
        } else {
          let model = create();
          this.registerLoad(model);
          return model;
        }
      }
      return current;
    }

    if(modelName.current) {
      let model = create();
      this.registerLoad(model);
      return model;
    }

    return null;
  }

  _createActivator(value) {
    return new ObjectActivator(this, value);
  }

  getPropertyValue() {
    let { activator } = this;
    let value = this._value.current;
    if(!activator) {
      this.value = value;
      activator = this._createActivator(value);
      this.activator = activator;
    } else {
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
    mapping: null,
    load: null,
  };

  let extend = () => {
    let curr = define(opts);
    curr.named = name => {
      if(isFunction(name)) {
        opts.modelName = name;
      } else {
        opts.modelName = () => name;
      }
      return extend();
    }
    curr.mapping = mapping => {
      assert(`@model().mapping(fn) must be function not '${mapping}'`, isFunction(mapping));
      opts.mapping = mapping;
      return extend();
    }
    curr.load = fn => {
      assert(`@model().load(fn) must be function not '${fn}'`, isFunction(fn));
      opts.load = fn;
      return extend();
    }
    return curr;
  }

  return extend();
}

import Property, { property, normalizeMapping } from './property';
import { getStores } from '../../stores/get-stores';
import ObjectActivator from './activate/activators/object';
import { diff, asOptionalString, asOptionalObject, asIdentity } from '../decorators/diff';
import { isFunction } from '../../util/object-to-json';
import { assert } from '@ember/debug';

const mappingDidChange = (owner, props, caller) => {
  assert(
    `${owner} requires mappingDidChange() because @${caller}().mapping(...) values has changed`,
    isFunction(owner.mappingDidChange)
  );
  owner.mappingDidChange(props);
};

export default class ModelProperty extends Property {

  @diff(asOptionalString)
  _modelName() {
    let { owner, opts } = this;
    return opts.modelName.call(owner, owner);
  }

  @diff(asOptionalObject)
  _props() {
    let { owner, opts } = this;
    if(opts.mapping) {
      return opts.mapping.call(owner, owner);
    }
  }

  @diff(asIdentity)
  _value(current) {
    let modelName = this._modelName;
    let props = this._props;
    if(current && !modelName.updated) {
      if(props.updated) {
        mappingDidChange(current, props.current, 'model');
      }
      return current;
    }
    if(modelName.current) {
      return getStores(this).models.create(modelName.current, props.current);
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
    curr.mapping = (...args) => {
      opts.mapping = normalizeMapping(args);
      return extend();
    }
    return curr;
  }

  return extend();
}

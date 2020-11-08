import Property, { property } from './property';
import { getStores } from '../../stores/get-stores';
import ObjectActivator from './activate/activators/object';
import { updated } from '../decorators/updated';

export default class ModelProperty extends Property {

  @updated()
  _modelName() {
    let { owner, opts } = this;
    return opts.modelName.call(owner, owner);
  }

  @updated()
  _props() {
    let { owner, opts } = this;
    return opts.mapping.call(owner, owner);
  }

  @updated()
  _value(curr) {
    let modelName = this._modelName;
    let props = this._props;
    let create = () => getStores(this).models.create(modelName.value, props.value);
    if(curr) {
      // console.log({ modelName, props});
      // have a marker for existing model to check if modelName differs
      // update props
    }
    return create();
  }

  _createActivator(value) {
    return new ObjectActivator(this, value);
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      let { value } = this._value;
      this.value = value;
      activator = this._createActivator(value);
      this.activator = activator;
    } else {
      let { value } = this._value;
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

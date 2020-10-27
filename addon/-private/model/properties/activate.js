import Property, { createProperty } from './property';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import ObjectActivator from './activate/object';
import ArrayActivator from './activate/array';
import { dirtyKey, consumeKey } from '../../model/tracking/tag';

export default class ActivateProperty extends Property {

  init() {
    super.init(...arguments);
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

  getPropertyValue() {
    consumeKey(this, 'activator');
    let { activator } = this;
    if(!activator) {
      return null;
    }
    return activator.getValue();
  }

  setPropertyValue(value) {
    dirtyKey(this, 'activator');
    let { activator } = this;
    if(!activator) {
      activator = this.createActivator(value);
      this.activator = activator;
    } else {
      assert([
        `Changing activator type is not supported.`,
        `Now property '${this.key}' for ${this.owner} is of type ${activator.type}`,
        `but value '${value}' asks for activator of type ${this.activatorTypeForValue(value)}`
      ].join(' '), activator.type === this.activatorTypeForValue(value));
    }
    return activator.setValue(value);
  }

  //

  onActivated() {
    consumeKey(this, 'activator');
    let { activator } = this;
    if(activator) {
      activator.activate();
    }
  }

  onDeactivated() {
    consumeKey(this, 'activator');
    let { activator } = this;
    if(activator) {
      activator.deactivate();
    }
  }

}

let getProperty = (owner, key) => createProperty(owner, key, 'activate', { opts: {} });

export const activate = () => (_, key) => {
  return {
    get() {
      return getProperty(this, key).getPropertyValue();
    },
    set(value) {
      return getProperty(this, key).setPropertyValue(value);
    }
  };
}

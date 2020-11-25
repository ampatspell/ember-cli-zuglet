import Property from '../property';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import ObjectActivator from './activators/object';
import ArrayActivator from './activators/array';

export default class BaseActivateProperty extends Property {

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

  assertActivatorType(activator, value) {
    assert([
      `Changing activator type is not supported.`,
      `Now property '${this.key}' for ${this.owner} is of type ${activator.type}`,
      `but value '${value}' asks for activator of type ${this.activatorTypeForValue(value)}`
    ].join(' '), activator.type === this.activatorTypeForValue(value));
  }

  //

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

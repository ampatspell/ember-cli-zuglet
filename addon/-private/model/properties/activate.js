import Property, { property } from './property';
import { getState } from '../state';

class ObjectActivator {

  value = null;
  isActivated = false;

  constructor(property) {
    this.property = property;
    this.isActivated = false;
    this.value = null;
  }

  activate() {
    if(!this.property.isActivated) {
      return;
    }

    if(this.isActivated) {
      return;
    }

    this.isActivated = true;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.activate(this.property);
      }
    }
  }

  deactivate () {
    if(!this.isActivated) {
      return;
    }

    this.isActivated = false;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.deactivate(this.property);
      }
    }
  }

  getValue() {
    this.activate();
    return this.value;
  }

  setValue(value) {
    this.deactivate();
    this.value = value;
    this.activate();
    return value;
  }

}

class ArrayActivator {
  constructor(property) {

  }
}

export default class ActivateProperty extends Property {

  init() {
    super.init(...arguments);
    this.activator = new ObjectActivator(this);
  }

  getPropertyValue() {
    return this.activator.getValue();
  }

  setPropertyValue(value) {
    if(value === this.value) {
      return value;
    }
    return this.activator.setValue(value);
  }

  onActivated() {
    this.activator.activate();
  }

  onDeactivated() {
    this.activator.deactivate();
  }

}

export const activate = property({
  readOnly: false,
  deps: [],
  property: 'activate',
  opts: {
  }
});

import Property, { property } from './property';
import { getState } from '../state';

export default class ActivateProperty extends Property {

  value = null

  init() {
    super.init(...arguments);
    this.isValueActivated = false;
  }

  activateValue() {
    if(!this.isActivated) {
      return;
    }

    if(this.isValueActivated) {
      return;
    }

    this.isValueActivated = true;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.activate(this);
      }
    }
  }

  deactivateValue() {
    if(!this.isValueActivated) {
      return;
    }

    this.isValueActivated = false;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.deactivate(this);
      }
    }
  }

  getPropertyValue() {
    this.activateValue();
    return this.value;
  }

  setPropertyValue(value) {
    if(value === this.value) {
      return value;
    }
    this.deactivateValue();
    this.value = value;
    this.activateValue();
    return value;
  }

  onActivated() {
    this.activateValue();
  }

  onDeactivated() {
    this.deactivateValue();
  }

  onOwnerWillDestroy() {
    this.deactivateValue();
  }

}

export const activate = property({
  readOnly: false,
  deps: [],
  property: 'activate',
  opts: {
  }
});

import Property, { property } from './property';
import { getState } from '../state';

export default class ActivateProperty extends Property {

  value = null

  init() {
    super.init(...arguments);
    this.value = this.opts.value;
    this.activated = false;
  }

  activate() {
    if(this.activated) {
      return;
    }

    this.activated = true;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.activate(this);
      }
    }
  }

  deactivate() {
    if(!this.activated) {
      return;
    }

    this.activated = false;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.deactivate(this);
      }
    }
  }

  getPropertyValue() {
    this.activate();
    return this.value;
  }

  setPropertyValue(value) {
    if(value === this.value) {
      return value;
    }
    this.deactivate();
    this.value = value;
    this.activate();
    return value;
  }

}

export const activate = value => property({
  readOnly: false,
  deps: [],
  property: 'activate',
  opts: {
    value
  }
});

import EmberObject from '@ember/object';
import toPrimitive from '../../../util/to-primitive';
import { getState } from '../../state';

export default class Property extends EmberObject {

  state = null;
  owner = null;
  key = null;
  opts = null;

  get isActivated() {
    return this.state.isActivated;
  }

  //

  notifyPropertyChange(key) {
    let path = this.key;
    if(key) {
      path = `${path}.${key}`;
    }
    this.owner.notifyPropertyChange(path);
  }

  activateValue(value) {
    if(value) {
      let state = getState(value);
      if(state) {
        state.activate(this);
      }
    }
  }

  deactivateValue(value) {
    if(value) {
      let state = getState(value);
      if(state) {
        state.deactivate(this);
      }
    }
  }

  //

  onActivated() {
  }

  onDeactivated() {
  }

  toStringExtension() {
    return `${toPrimitive(this.owner)}.${this.key}`;
  }

}

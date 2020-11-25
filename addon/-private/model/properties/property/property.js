import EmberObject from '@ember/object';
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

}

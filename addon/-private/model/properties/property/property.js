import ZugletObject from '../../../object';
import { getState } from '../../state';

export default class Property extends ZugletObject {

  state = null;
  owner = null;
  key = null;
  opts = null;

  constructor(_owner, { state, owner, key, opts }) {
    super(_owner);
    this.state = state;
    this.owner = owner;
    this.key = key;
    this.opts = opts;
  }

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

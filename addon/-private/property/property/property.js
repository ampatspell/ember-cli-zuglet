import EmberObject from '@ember/object';

export default class Property extends EmberObject {

  state = null;
  owner = null;
  key = null;
  opts = null;

  get isActivated() {
    return this.state.isActivated;
  }

  onActivated() {
  }

  onDeactivated() {
  }

  onOwnerWillDestroy() {
  }

}

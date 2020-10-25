import EmberObject from '@ember/object';
import toPrimitive from '../../../util/to-primitive';

export default class Property extends EmberObject {

  state = null;
  owner = null;
  key = null;
  opts = null;

  get isActivated() {
    return this.state.isActivated;
  }

  notifyPropertyChange() {
    this.owner.notifyPropertyChange(this.key);
  }

  onActivated() {
  }

  onDeactivated() {
  }

  toStringExtension() {
    return `${toPrimitive(this.owner)}.${this.key}`;
  }

}

import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';

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
    return `${this.owner.constructor.name}::${guidFor(this.owner)}.${this.key}`;
  }

}

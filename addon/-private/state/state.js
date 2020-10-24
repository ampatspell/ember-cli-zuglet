import EmberObject from '@ember/object';
import { associateDestroyableChild } from '@ember/destroyable';
import { assert } from '@ember/debug';

export default class State extends EmberObject {

  owner = null
  properties = Object.create(null);
  activators = new Set();

  init() {
    super.init(...arguments);
    associateDestroyableChild(this.owner, this);
  }

  getProperty(key, create) {
    let property = this.properties[key];
    if(!property && create) {
      property = create();
      associateDestroyableChild(this, property);
      this.properties[key] = property;
    }
    return property;
  }

  get isActivated() {
    return this.activators.size > 0;
  }

  activate(activator) {
    assert(`activator ${activator} already has activated ${this.owner}`, !this.activators.has(activator));
    this.activators.add(activator);
    this.owner.isActivated = this.isActivated;
  }

  deactivate(activator) {
    assert(`activator ${activator} hasn't activated ${this.owner}`, this.activators.has(activator));
    this.activators.delete(activator);
    this.owner.isActivated = this.isActivated;
  }

}

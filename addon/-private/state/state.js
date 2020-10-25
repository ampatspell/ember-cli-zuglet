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
      property = create(this);
      associateDestroyableChild(this, property);
      this.properties[key] = property;
    }
    return property;
  }

  withProperties(cb) {
    Object.values(this.properties).forEach(property => cb(property));
  }

  //

  invokeOnOwner(name, ...args) {
    let { owner } = this;
    let fn = owner[name];
    if(!fn) {
      return;
    }
    return fn.call(owner, ...args);
  }

  //

  get isActivated() {
    return this.activators.size > 0;
  }

  onActivated() {
    this.owner.isActivated = true;
    this.withProperties(property => property.onActivated());
    this.invokeOnOwner('onActivated');
  }

  onDeactivated() {
    this.owner.isActivated = false;
    this.invokeOnOwner('onDeactivated');
    this.withProperties(property => property.onDeactivated());
  }

  activate(activator) {
    assert(`activator is requied`, !!activator);
    assert(`activator ${activator} already has activated ${this.owner}`, !this.activators.has(activator));

    let { activators } = this;
    activators.add(activator);

    if(activators.size === 1) {
      this.onActivated();
    }
  }

  deactivate(activator) {
    assert(`activator is requied`, !!activator);
    assert(`activator ${activator} hasn't activated ${this.owner}`, this.activators.has(activator));

    let { activators } = this;
    activators.delete(activator);

    if(activators.size === 0) {
      this.onDeactivated();
    }
  }

}

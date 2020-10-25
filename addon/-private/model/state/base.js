import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { registerActivated, unregisterActivated } from '../../store/stats';

export default class State extends EmberObject {

  owner = null
  properties = Object.create(null);
  activators = new Set();

  registersActivated = true

  getProperty(key, create) {
    let property = this.properties[key];
    if(!property && create) {
      property = create(this);
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
    if(this.registersActivated) {
      registerActivated(this.owner);
    }
    this.withProperties(property => property.onActivated());
    this.invokeOnOwner('onActivated');
  }

  onDeactivated() {
    this.invokeOnOwner('onDeactivated');
    this.withProperties(property => property.onDeactivated());
    if(this.registersActivated) {
      unregisterActivated(this.owner);
    }
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

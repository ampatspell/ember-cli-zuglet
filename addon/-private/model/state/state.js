import ZugletObject from '../../object';
import { assert } from '@ember/debug';
import { registerActivated, unregisterActivated } from '../../stores/stats';
import Activators from './activators';

export default class State extends ZugletObject {

  owner = null
  properties = Object.create(null);
  activators = new Activators();
  cache = Object.create(null);

  constructor(_owner, { owner }) {
    super(_owner);
    this.owner = owner;
  }

  didCreateState() {}

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

  _loadOnActivated = null;

  setLoadOnActivated(fn) {
    this._loadOnActivated = fn;
  }

  _invokeOnActivatedHooks() {
    let { _loadOnActivated } = this;
    if(_loadOnActivated) {
      _loadOnActivated();
      this._loadOnActivated = null;
    }
  }

  //

  get isActivated() {
    return this.activators.size > 0;
  }

  onActivated() {
    registerActivated(this.owner);
    this.withProperties(property => property.onActivated());
    this.invokeOnOwner('onActivated');
    this._invokeOnActivatedHooks();
  }

  onDeactivated() {
    this.invokeOnOwner('onDeactivated');
    this.withProperties(property => property.onDeactivated());
    unregisterActivated(this.owner);
  }

  activate(activator) {
    assert(`activator is required`, !!activator);

    let { activators } = this;
    activators.add(activator);

    if(activators.size === 1) {
      this.onActivated();
    }
  }

  deactivate(activator) {
    assert(`activator is required`, !!activator);

    let { activators } = this;
    activators.delete(activator);

    if(activators.size === 0) {
      this.onDeactivated();
    }
  }

}

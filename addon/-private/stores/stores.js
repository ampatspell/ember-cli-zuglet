import ZugletObject from '../../object';
import { getOwner } from '../util/get-owner';
import { associateDestroyableChild, destroy } from '@ember/destroyable';
import { getFactory } from '../factory/get-factory';
import { cached } from '../model/decorators/cached';
import { tracked } from "@glimmer/tracking"
import { assert } from '@ember/debug';

const {
  assign
} = Object;

export default class Stores extends ZugletObject {

  static create(owner) {
    return new this(getOwner(owner));
  }

  destroy() {
    destroy(this);
  }

  //

  @tracked
  stores = []

  @cached()
  get factory() {
    return getFactory(this);
  }

  get models() {
    return this.factory.models;
  }

  @cached()
  get stats() {
    let stores = this;
    return this.factory.zuglet.create('stores/stats', { stores });
  }

  _registerStoreFactory(identifier, factory) {
    let { factory: { zuglet } } = this;
    let name = `store/${identifier}`;
    let registered = zuglet.factoryFor(name, { optional: true });
    if(!registered) {
      zuglet.registerFactory(name, factory);
      registered = zuglet.factoryFor(name);
    }
    return registered;
  }

  _createStore(identifier, factory) {
    let { create } = this._registerStoreFactory(identifier, factory);
    let stores = this;
    let store = create({ stores, identifier });
    associateDestroyableChild(this, store);
    store._initialize();
    return store;
  }

  createStore(identifier, factory) {
    let store = this.store(identifier, { optional: true });
    assert(`store '${identifier}' is already registered`, !store);
    store = this._createStore(identifier, factory);
    this.stores = [ ...this.stores, store ];
    return store;
  }

  store(identifier, opts) {
    let { optional } = assign({ optional: false }, opts);
    let store = this.stores.find(store => store.identifier === identifier);
    assert(`store '${identifier}' is not registered`, !!store || optional);
    return store;
  }

  async settle() {
    await this.stats.settle();
  }

}

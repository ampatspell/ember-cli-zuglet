import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';
import { cached } from '../model/decorators/cached';
import { tracked } from "@glimmer/tracking"
import { assert } from '@ember/debug';
import { delay } from '../util/delay';

const {
  assign
} = Object;

export default class Stores extends EmberObject {

  @tracked
  stores = []

  @cached()
  get stats() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stores/stats').create({ stores });
  }

  @cached()
  get models() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stores/models').create({ stores });
  }

  _registerStoreFactory(identifier, factory) {
    let factoryName = `zuglet:store/${identifier}`;
    let registered = getOwner(this).factoryFor(factoryName);
    if(!registered) {
      getOwner(this).register(factoryName, factory);
      registered = getOwner(this).factoryFor(factoryName);
    }
    return registered;
  }

  createStore(identifier, factory) {
    let store = this.store(identifier, { optional: true });
    assert(`store '${identifier}' is already registered`, !store);
    let stores = this;
    factory = this._registerStoreFactory(identifier, factory);
    store = factory.create({ stores, identifier });
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
    await delay(1000);
    console.log(this.stats.snapshots.map(i=>i+""));
  }

  willDestroy() {
    this.stores.map(store => store.destroy());
    this.stats.destroy();
    super.willDestroy(...arguments);
  }

}

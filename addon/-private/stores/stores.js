import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';
import { cached } from '../model/decorators/cached';
import { tracked } from "@glimmer/tracking"

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
    let stores = this;
    factory = this._registerStoreFactory(identifier, factory);
    let store = factory.create({ stores, identifier });
    this.stores = [ ...this.stores, store ];
    return store;
  }

}

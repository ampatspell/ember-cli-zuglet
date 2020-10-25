import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../util/get-owner';

export default class Stores extends EmberObject {

  @computed()
  get stats() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stores/stats').create({ stores });
  }

  @computed()
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
    return factory.create({ stores, identifier });
  }

}

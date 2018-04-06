import Internal from './internal';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { all } from 'rsvp';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.stores = A();
  },

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  _registerStoreFactory(identifier, factory) {
    let factoryName = `zuglet:store/${identifier}`;
    let registered = this.factoryFor(factoryName);
    if(!registered) {
      getOwner(this).register(factoryName, factory);
      registered = this.factoryFor(factoryName);
    }
    return registered;
  },

  _createInternalStore(identifier, factory) {
    factory = this._registerStoreFactory(identifier, factory);
    return this.factoryFor('zuglet:store/internal').create({ stores: this, identifier, factory });
  },

  createStore(identifier, factory) {
    let internal = this._createInternalStore(identifier, factory);
    this.get('stores').pushObject(internal);
    return internal;
  },

  ready() {
    return all(this.get('stores').map(store => store.get('ready')));
  },

  willDestroy() {
    this.get('stores').map(store => store.destroy());
    this._super(...arguments);
  }

});

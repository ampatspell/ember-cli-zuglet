import Internal from '../internal/internal';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { all } from 'rsvp';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.stores = A();
    this.willDestroyListeners = A();
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

  settle() {
    return all(this.get('stores').map(store => store.settle()));
  },

  registerWillDestroyListener(fn) {
    let array = this.get('willDestroyListeners');
    array.pushObject(fn);
    let removed = false;
    return () => {
      if(removed) {
        return;
      }
      removed = true;
      array.removeObject(fn);
    };
  },

  willDestroy() {
    this.get('willDestroyListeners').map(fn => fn());
    this.get('stores').map(store => store.destroy());
    this._super(...arguments);
  }

});

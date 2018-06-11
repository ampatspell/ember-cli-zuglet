import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Pool from './pool';

export default EmberObject.extend({

  pools: null,

  init() {
    this._super(...arguments);
    console.log('init', this+'');
    this.pools = Object.create(null);
  },

  _createPool(identifier) {
    return Pool.create({ identifier });
  },

  poolForIdentifier(identifier, create=true) {
    let pool = this.pools[identifier];
    if(!pool && create) {
      pool = this._createPool(identifier);
      this.pools[identifier] = pool;
    }
    return pool;
  },

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  },

  toString() {
    return `<zuglet:firebase/pools::${guidFor(this)}>`;
  }

});

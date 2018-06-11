import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default EmberObject.extend({

  init() {
    this._super(...arguments);
    console.log('init', this+'');
  },

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  },

  toString() {
    return `<zuglet:firebase/pool::${guidFor(this)}>`;
  }

});

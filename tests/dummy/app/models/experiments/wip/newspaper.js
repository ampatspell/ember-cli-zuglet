import EmberObject from '@ember/object';

export default EmberObject.extend({

  id: null,

  init() {
    this._super(...arguments);
    console.log('init', this+'');
  },

  prepare({ id }) {
    this.setProperties({ id });
  },

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  },

  toStringExtension() {
    return this.id;
  }

});

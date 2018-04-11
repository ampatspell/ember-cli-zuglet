import Internal from '../internal/internal';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = Object.create(null);
  },

  createModel() {
    return this.store.factoryFor('zuglet:data/object').create({ _internal: this });
  },

  getModelValue(key) {
    return this.content[key];
  },

  setModelValue(key, value) {
    // deserialize(value, 'model');
    this.content[key] = value;
  }

});

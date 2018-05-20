import Internal from '../internal/internal';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = Object.create(null);
  },

  createModel() {
    return this.factoryFor('zuglet:data/object').create({ _internal: this });
  },

  getModelValue(key) {
    return this.serializer.getModelValue(this, key);
  },

  setModelValue(key, value) {
    return this.serializer.setModelValue(this, key, value);
  },

  // fetch() {
  //   return this.withPropertyChanges(true, changed => {
  //     return this.serializer.fetch(this, changed);
  //   });
  // }

});

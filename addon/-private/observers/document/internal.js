import Internal from '../observer/internal';

export default Internal.extend({

  doc: null,

  createModel() {
    return this.store.factoryFor('zuglet:observer/document').create({ _internal: this });
  }

});

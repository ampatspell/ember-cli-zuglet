import Internal from '../internal/internal';

export default Internal.extend({

  store: null,

  createModel() {
    return this.store.factoryFor('zuglet:batch').create({ _internal: this });
  }

});

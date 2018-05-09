import Internal from '../observer/internal';

export default Internal.extend({

  query: null,

  createModel() {
    return this.store.factoryFor('zuglet:observer/query').create({ _internal: this });
  }

});

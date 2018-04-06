import QueryInternal from '../internal';

export default QueryInternal.extend({

  createModel() {
    return this.store.factoryFor('zuglet:query/array').create({ _internal: this });
  }

});

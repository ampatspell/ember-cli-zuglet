import Internal from '../../internal/internal';

export default Internal.extend({

  manager: null,

  factoryFor(name) {
    return this.manager.factoryFor(name);
  },

  commit(internal, data={}) {
    this.deserialize(internal, data, true);
  },

  rollback(internal) {
    let data = internal.get('raw');
    if(!data) {
      return;
    }
    this.deserialize(internal, data, false);
  }

});

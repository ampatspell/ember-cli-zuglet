import Internal from '../../../internal/internal';

export default Internal.extend({

  ref: null,

  factoryFor(name) {
    return this.ref.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:storage/reference/metadata').create({ _internal: this });
  },

  load(opts={}) {    
  }

});

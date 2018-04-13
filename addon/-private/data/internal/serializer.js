import Internal from '../../internal/internal';

export default Internal.extend({

  manager: null,

  matches(internal, value) {
    return this.supports(value);
  },

  factoryFor(name) {
    return this.manager.factoryFor(name);
  }

});

import Internal from '../../internal/internal';

export default Internal.extend({

  manager: null,

  factoryFor(name) {
    return this.manager.factoryFor(name);
  }

});

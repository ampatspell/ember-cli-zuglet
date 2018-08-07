import { getOwner } from '@ember/application';
import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  key: null,
  dependencies: null,
  factory: null,
  mapping: null,

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:computed/models').create({ _internal: this });
  }

});

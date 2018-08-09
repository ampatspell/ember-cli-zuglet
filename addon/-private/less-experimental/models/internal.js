import Internal from '../../internal/internal';
import { getOwner } from '@ember/application';

export default Internal.extend({

  parent: null,
  key: null,
  opts: null, // { source, owner, object, inline, named, mapping }

  createModel() {
    return getOwner(this.parent).factoryFor('zuglet:less-experimental/models').create({ _internal: this });
  },

  willDestroy() {
    this._super(...arguments);
  }

});

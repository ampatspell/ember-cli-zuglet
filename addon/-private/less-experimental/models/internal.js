import Internal from '../../internal/internal';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';

export default Internal.extend({

  parent: null,
  key: null,
  opts: null, // { source, owner, object, inline, named, mapping }

  init() {
    this._super(...arguments);
    this.content = A();
  },

  createModel() {
    let content = this.content;
    return getOwner(this.parent).factoryFor('zuglet:less-experimental/models').create({ _internal: this, content });
  },

  willDestroy() {
    this._super(...arguments);
  }

});

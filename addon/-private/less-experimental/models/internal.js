import Internal from '../../internal/internal';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import Runtime from './runtime';

export default Internal.extend({

  parent: null,
  key: null,
  opts: null, // { source, owner, object, inline, named, mapping }

  runtime(create) {
    let runtime = this._runtime;
    if(!runtime && create) {
      let { parent, key, opts } = this.getProperties('parent', 'key', 'opts');
      runtime = new Runtime(parent, key, opts);
      this._runtime = runtime;
    }
    return runtime;
  },

  createModel() {
    let content = this.runtime(true).content;
    return getOwner(this.parent).factoryFor('zuglet:less-experimental/models').create({ _internal: this, content });
  },

  willDestroy() {
    this._super(...arguments);
    this._runtime && this._runtime.destroy();
  }

});

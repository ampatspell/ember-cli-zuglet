import QueryInternal from '../internal';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';

export default QueryInternal.extend({

  type: 'first',

  createModel() {
    return this.store.factoryFor('zuglet:query/first').create({ _internal: this });
  },

});

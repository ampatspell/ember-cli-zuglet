import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import destroyCached from '../../util/destroy-cached';

export default Internal.extend({

  storage: null,
  ref: null,

  factoryFor(name) {
    return this.storage.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:storage/reference').create({ _internal: this });
  },

  metadata: computed(function() {
    return this.factoryFor('zuglet:storage/reference/metadata/internal').create({ ref: this });
  }).readOnly(),

  load(opts) {
    return this.get('metadata').load(opts);
  },

  willDestroy() {
    destroyCached(this, 'metadata');
    this._super(...arguments);
  }

});

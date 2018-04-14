import Internal from '../../internal/internal';
import { computed } from '@ember/object';

export default Internal.extend({

  user: null,

  init() {
    this._super(...arguments);
    this.set('user', this.factoryFor('zuglet:auth/user/internal').create({ auth: this }));
  },

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:auth').create({ _internal: this });
  },

  methods: computed(function() {
    return this.store.factoryFor('zuglet:auth/methods/internal').create({ auth: this });
  }).readOnly(),

});

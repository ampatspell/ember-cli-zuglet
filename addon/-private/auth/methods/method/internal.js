import Internal from '../../../internal/internal';
import { readOnly } from '@ember/object/computed';

export default Internal.extend({

  methods: null,
  type: null,

  auth: readOnly('methods.auth'),

  createModel() {
    let type = this.get('type');
    return this.methods.factoryFor(`zuglet:auth/method/${type}`).create({ _internal: this });
  },

  withAuth(fn) {
    return this.get('auth').withAuth(fn);
  },

  withAuthReturningUser(fn) {
    return this.get('auth').withAuthReturningUser(fn);
  }

});

import Internal from '../../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  auth: null,
  user: null,

  createModel() {
    return this.auth.factoryFor('zuglet:auth/user').create({ _internal: this });
  },

  onDeleted() {
    this.get('auth').onUser(null);
  },

  delete() {
    return resolve(this.user.delete()).then(() => this.onDeleted());
  }

});

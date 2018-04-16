import Internal from '../../internal/internal';
import { resolve } from 'rsvp';

export default Internal.extend({

  auth: null,
  user: null,

  createModel() {
    return this.auth.factoryFor('zuglet:auth/user').create({ _internal: this });
  },

  restore() {
    let store = this.get('auth.store');
    return resolve().then(() => {
      if(this.isDestroying || store.isDestroying) {
        return;
      }
      return store.model(true).restoreUser(this.model(true));
    });
  },

  onDeleted() {
    this.get('auth').onUser(null);
  },

  delete() {
    return resolve(this.user.delete()).then(() => this.onDeleted());
  },

});

import Internal from '../../internal/internal';
import { resolve } from 'rsvp';
import { assign } from '@ember/polyfills';

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
  },

  token(opts={}) {
    let { type, refresh } = assign({ type: 'string', refresh: false }, opts);
    if(type === 'string') {
      return resolve(this.user.getIdToken(refresh));
    } else if(type === 'json') {
      return resolve(this.user.getIdTokenResult(refresh));
    }
  },

  link(method, ...args) {
    method = this.get(`auth.methods`).method(method);
    let credential = method.credential(...args);
    return this.get('auth').withAuthReturningUser(() => {
      return this.user.linkWithCredential(credential).then(({ user }) => user);
    });
  }

});

import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  layout,

  doc: readOnly('store.user.doc'),

  actions: {
    signOut() {
      this.get('store.auth').signOut();
    },
    signInAnonymous() {
      this.get('store.auth.methods.anonymous').signIn();
    },
    signInEmail(email, password) {
      this.get('store.auth.methods.email').signIn(email, password);
    }
  }

});

import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

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

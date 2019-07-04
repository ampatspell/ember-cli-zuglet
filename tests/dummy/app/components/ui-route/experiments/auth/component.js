import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

let times = 0;

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
    },
    loop() {
      this.loop();
    }
  },

  async loop() {
    await this.store.auth.signOut();
    await this.store.auth.methods.email.signIn('zeeba@gmail.com', 'heythere');
    times++;
    if(times > 10) {
      return;
    }
    this.loop();
  }

});

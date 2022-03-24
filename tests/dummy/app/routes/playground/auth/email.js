import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MessagesRoute extends Route {

  @service store;
  @service router;

  async model({ email }) {
    try {
      await this.store.auth.methods.email.signInWithLink(email);
    } catch(err) {
      console.log(err);
    }
    this.router.transitionTo('playground.auth');
  }

}

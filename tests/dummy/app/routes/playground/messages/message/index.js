import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class MessagesMessageIndexRoute extends Route {

  @service
  store

  model() {
    let message = this.modelFor('playground.messages.message');
    return this.store.models.create('pages/messages/message/index', { message });
  }

  async load(model) {
    await model.load();
    // let loaded = await model.load();
    // if(!loaded) {
    //   this.transitionTo('playground.messages');
    // }
  }

}

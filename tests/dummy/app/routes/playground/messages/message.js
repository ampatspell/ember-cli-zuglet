import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class MessagesMessageRoute extends Route {

  @service
  store

  model({ message_id: id }) {
    let messages = this.modelFor('playground.messages');
    return this.store.models.create('pages/messages/message', { messages, id });
  }

  async load(model) {
    await model.load();
  }

  afterModel(model) {
    if(!model.message) {
      this.transitionTo('playground.messages');
    }
  }

}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class MessagesRoute extends Route {

  @service
  store

  model() {
    return this.store.models.create('messages');
  }

  async load(model) {
    await model.load();
  }

}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class RouteRoute extends Route {

  @service
  store

  // is activated when this returns
  async model() {
    return this.store.models.create('messages');
  }

  // right after model is activated
  // optionally preload data before model() hook resolves
  async load(model) {
    await model.load();
  }

}

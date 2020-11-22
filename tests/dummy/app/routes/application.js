import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class RouteRoute extends Route {

  @service
  store

  model() {
  }

  async load() {
    // resolve current user before rendering app
    await this.store.load();
  }

}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class RouteRoute extends Route {

  @service
  store

  model() {
    // activate store which is @root()
    return this.store;
  }

  async load(store) {
    // resolve current user before rendering app
    await store.load();
  }

}

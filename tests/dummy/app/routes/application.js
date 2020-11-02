import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';
import { load } from 'zuglet/utils';

@route()
export default class RouteRoute extends Route {

  @service
  store

  model() {
    return this.store.auth;
  }

  async load(auth) {
    // resolve current user before rendering app
    await load(auth);
  }

}

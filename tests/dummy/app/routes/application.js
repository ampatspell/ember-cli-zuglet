import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';
import { load } from 'zuglet/utils';

@route()
export default class RouteRoute extends Route {

  @service
  store

  async model() {
  }

  async load() {
    // resolve current user before rendering app
    await load(this.store.auth);
  }

}

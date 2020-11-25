import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';
import { load } from 'zuglet/utils';

@route()
export default class ApplicationRoute extends Route {

  @service
  store

  async model() {
  }

  async load() {
    await load(this.store.auth);
  }

}

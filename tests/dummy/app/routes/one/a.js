import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class OneRoute extends Route {

  @service
  store

  async model() {
    return this.store.doc('messages/one').new({ name: 'one/a' });
  }

}

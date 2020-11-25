import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class IndexRoute extends Route {

  @service
  store

  async model() {
    return this.store.doc('messages/first').new({
      message: 'To whom it may concern: It is springtime. It is late afternoon.'
    });
  }

  async load(doc) {
    return await doc.save();
  }

}

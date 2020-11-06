import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {

  @service
  docs

  model() {
    return this.docs.load('index');
  }

}

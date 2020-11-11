import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DocsPageRoute extends Route {

  @service
  docs

  model({ page_id: id }) {
    if(id === 'index') {
      return this.transitionTo('index');
    }
    return this.docs.load(id);
  }

}

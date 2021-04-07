import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DocsPageRoute extends Route {

  @service docs;

  async model({ page_id: id }) {
    if(id === 'index') {
      return this.transitionTo('index');
    }
    let page = await this.docs.page(id)?.load();
    return {
      id,
      page
    };
  }

}

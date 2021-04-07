import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class IndexRoute extends Route {

  @service
  docs

  async model() {
    let pages = await hash(this.docs.directory('index').reduce((hash, page) => {
      hash[page.name] = page.load();
      return hash;
    }, {}));
    return {
      pages
    };
  }

}

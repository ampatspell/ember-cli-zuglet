import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class IndexRoute extends Route {

  @service
  docs

  async model() {
    let pages = this.docs.directory('index');
    await Promise.all(pages.map(page => page.load()));

    pages = pages.reduce((hash, page) => {
      hash[page.name] = page;
      return hash;
    }, {});

    return {
      pages
    };
  }

}

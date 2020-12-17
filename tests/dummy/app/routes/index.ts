import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import type DocsService from '../services/docs';

export default class IndexRoute extends Route {

  @service
  docs!: DocsService

  async model(): Promise<any> {
    const pages = await hash(this.docs.page('index').pages.reduce((hash: any, page: any) => {
      hash[page.name] = page.load();
      return hash;
    }, {}));
    return {
      pages
    };
  }

}

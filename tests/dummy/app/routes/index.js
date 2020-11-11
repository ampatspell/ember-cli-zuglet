import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

let names = [
  'about',
  'install',
  'why',
  'use'
];

export default class IndexRoute extends Route {

  @service
  docs

  async model() {
    let pages = await hash(names.reduce((hash, key) => {
      hash[key] = this.docs.load(`index/${key}`);
      return hash;
    }, {}));

    return {
      pages
    };
  }

}

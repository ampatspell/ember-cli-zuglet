import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { getOwner } from '@ember/application';

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
    let config = getOwner(this).factoryFor('config:environment').class;
    let version = config.dummy.version;

    let pages = await hash(names.reduce((hash, key) => {
      hash[key] = this.docs.load(`index/${key}`);
      return hash;
    }, {}));

    return {
      pages,
      version
    };
  }

}

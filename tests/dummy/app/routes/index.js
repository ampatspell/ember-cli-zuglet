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

  model() {
    let { docs } = this;
    return hash(names.reduce((hash, key) => {
      hash[key] = docs.load(`index/${key}`);
      return hash;
    }, {}));
  }

}

import Route from '@ember/routing/route';
import { hash } from 'rsvp';

const names = [
  'about',
  'install',
  'why',
  'use'
];

export default Route.extend({

  model() {
    let docs = this.get('docs');
    return hash(names.reduce((hash, key) => {
      hash[key] = docs.load(`index/${key}`);
      return hash;
    }, {}));
  }

});

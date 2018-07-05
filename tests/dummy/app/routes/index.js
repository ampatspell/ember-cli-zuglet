import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({

  model() {
    let docs = this.get('docs');
    return hash([ 'about', 'install', 'why', 'use' ].reduce((hash, key) => {
      hash[key] = docs.load(`index/${key}`);
      return hash;
    }, {}));
  }

});

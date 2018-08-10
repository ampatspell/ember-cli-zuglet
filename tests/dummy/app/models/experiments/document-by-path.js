import EmberObject from '@ember/object';
import { observed } from 'ember-cli-zuglet/less-experimental';

const isKindaValidPath = path => {
  if(!path) {
    return false;
  }
  let segments = path.split('/');
  if(segments.length % 2 !== 0) {
    return false;
  }
  if(segments.filter(segment => !segment).length) {
    return false;
  }
  return true;
}

export default EmberObject.extend({

  doc: observed(),

  prepare({ path }) {
    if(!isKindaValidPath(path)) {
      return;
    }
    path = path.trim();
    let doc = this.store.doc(path).existing();
    this.setProperties({ doc });
  }

});

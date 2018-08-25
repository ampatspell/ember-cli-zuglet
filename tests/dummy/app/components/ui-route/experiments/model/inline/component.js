import Component from '@ember/component';
import layout from './template';
import { model, observed } from 'ember-cli-zuglet/lifecycle';

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

export default Component.extend({
  layout,

  model: model().owner('path').inline({

    doc: observed(),

    prepare(owner) {
      let path = owner.get('path');
      if(!isKindaValidPath(path)) {
        return;
      }
      path = path.trim();
      let doc = this.store.doc(path).existing();
      this.setProperties({ doc });
    }

  })

});

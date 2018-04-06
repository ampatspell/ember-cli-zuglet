import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  query: window.query,

  actions: {
    select(doc) {
      this.doc && this.doc();
      this.doc = doc.observe();
      // doc.load();
    },
    start() {
      this.set('cancel', this.get('query').observe());
    },
    stop() {
      let cancel = this.get('cancel');
      cancel();
      this.set('cancel', null);
    }
  }

});

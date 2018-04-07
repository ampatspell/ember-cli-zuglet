import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  query: computed(function() {
    let store = this.get('store');

    window.store = store;

    let query = store.collection('ducks').orderBy('name').query({ type: 'array' });
    query.load();
    return query;
  }),

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

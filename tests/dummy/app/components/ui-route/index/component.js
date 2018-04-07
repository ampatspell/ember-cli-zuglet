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
    select(model) {
      if(model.get('isObserving')) {
        model.cancel && model.cancel();
      } else {
        let cancel = model.observe();
        model.cancel = cancel;
      }
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

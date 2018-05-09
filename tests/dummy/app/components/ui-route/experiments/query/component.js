import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  query: computed(function() {
    let store = this.get('store');
    let query = store.collection('ducks').orderBy('name').query({ type: 'array' });
    query.load();
    return query;
  }),

  actions: {
    select(model) {
      if(model.get('isObserving')) {
        model.observer && model.observer.cancel();
      } else {
        let observer = model.observe();
        model.observer = observer;
      }
    },
    start() {
      this.set('observer', this.get('query').observe());
    },
    stop() {
      let observer = this.get('observer');
      observer.cancel();
      this.set('observer', null);
    }
  }

});

import Observer from '../observer/observer';
import { computed } from '@ember/object';

export default Observer.extend({

  query: computed(function() {
    return this.get('_internal.query').model(true);
  }).readOnly(),

  toStringExtension() {
    return this.get('query.string');
  }

});

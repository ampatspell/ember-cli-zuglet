import Observer from '../observer/observer';
import { computed } from '@ember/object';

export default Observer.extend({

  content: computed(function() {
    return this.get('_internal.doc').model(true);
  }).readOnly(),

  toStringExtension() {
    return this.get('content.path');
  }

});

import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default EmberObject.extend({

  queue: null,
  owner: null,
  opts: null,

  promise: computed(function() {
    return resolve(this.get('opts.promise'));
  }).readOnly(),

  invoke() {
    return this.get('promise');
  }

});

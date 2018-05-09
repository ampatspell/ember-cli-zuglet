import Internal from '../../internal/internal';
import { computed } from '@ember/object';

export default Internal.extend({

  isCancelled: false,
  state: null,

  promise: computed('state.promise', function() {
    let promise = this.get('state.promise');
    return promise.then(() => this.model(true));
  }).readOnly(),

  cancel() {
    this.set('isCancelled', true);
    let cancel = this.get('state.cancel');
    cancel();
  },

  load() {
    return this.get('promise');
  },

  willDestroy() {
    this.cancel();
    this._super(...arguments);
  }

});
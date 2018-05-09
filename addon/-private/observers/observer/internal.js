import Internal from '../../internal/internal';

export default Internal.extend({

  isCancelled: false,
  state: null,

  cancel() {
    this.set('isCancelled', true);
    let cancel = this.get('state.cancel');
    cancel();
  },

  load() {
    return this.get('state.promise');
  },

  willDestroy() {
    this.cancel();
    this._super(...arguments);
  }

});
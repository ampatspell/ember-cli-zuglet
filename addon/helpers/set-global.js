import Helper from '@ember/component/helper';
import setGlobal from 'ember-cli-zuglet/-private/util/set-global';

export default Helper.extend({

  cancel() {
    this._cancel && this._cancel();
  },

  compute(params, hash) {
    this.cancel();
    this._cancel = setGlobal(this, hash);
  },

  willDestroy() {
    this.cancel();
    this._super(...arguments);
  }

});

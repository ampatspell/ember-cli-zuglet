import Internal from '../base/internal';
import { assign } from '@ember/polyfills';

export const state = [ 'isExisting', 'isLoading', 'isLoaded', 'isError', 'error' ];

export default Internal.extend({

  ref: null,

  value: null,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/url').create({ _internal: this });
  },

  load(opts={}) {
    return this.ref.load(assign({ url: true, metadata: false }, opts));
  },

});

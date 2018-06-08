import Internal from '../base/internal';

export const state = [ 'isExisting', 'isLoading', 'isLoaded', 'isError', 'error' ];

export default Internal.extend({

  ref: null,

  createModel() {
    return this.factoryFor('zuglet:storage/reference/url').create({ _internal: this });
  },

});

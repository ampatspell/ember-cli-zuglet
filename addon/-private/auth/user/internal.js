import Internal from '../../internal/internal';

export default Internal.extend({

  auth: null,

  createModel() {
    return this.auth.factoryFor('zuglet:auth/user').create({ _internal: this });
  },

});

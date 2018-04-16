import Store from 'ember-cli-zuglet/store';
import environment from './config/environment';

const {
  firebase: options
} = environment;

export default Store.extend({

  options,

  // restore() {
  //
  // },

  // restoreUser(user) {
  //   console.log('restoreUser', user);
  // }

});

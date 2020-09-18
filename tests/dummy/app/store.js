import Store from 'ember-cli-zuglet/store';
import environment from './config/environment';

const {
  firebase: options
} = environment;

export default Store.extend({

  options,

  user: null,

  async restoreUser(user) {
    let next = null;
    if(user) {
      next = this.models.create('user', { user });
    }

    let current = this.user;
    this.set('user', next);

    if(current) {
      current.destroy();
    }

    if(next) {
      await next.restore();
    }
  },

  onError({ model, operation, err, opts }) {
    let args = [
      `onError ${operation} ${err.message} ${model}`,
    ];
    if(opts) {
      args.push(opts);
    }
    console.error(...args);
  }

});

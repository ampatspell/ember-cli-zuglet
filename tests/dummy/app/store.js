import Store from 'ember-cli-zuglet/store';
import environment from './config/environment';

const {
  firebase: options
} = environment;

export default Store.extend({

  options,

  user: null,

  async restoreUser(user) {
    let current = this.user;
    if(current && user && user.uid === current.uid) {
      current.set('user', user);
      await current.restore();
    } else {
      let next = null;
      if(user) {
        next = this.models.create('user', { user });
        await next.restore();
      }
      this.set('user', next);
      current && current.destroy();
    }
  }

});

import Store from 'ember-cli-zuglet/store';
import environment from './config/environment';

const {
  firebase: options
} = environment;

export default Store.extend({

  options,

  user: null,

  async restoreUser(user) {
    console.log('store.restoreUser', user && user.uid);
    let current = this.user;

    let next = null;
    if(user) {
      next = this.models.create('user', { user });
    }

    this.set('user', next);

    if(current) {
      current.destroy();
    }

    if(next) {
      await next.restore();
    }

    // let current = this.user;
    // if(current && user && user.uid === current.uid) {
    //   current.set('user', user);
    //   await current.restore();
    // } else {
    //   let next = null;
    //   if(user) {
    //     next = this.models.create('user', { user });
    //   }
    //   this.set('user', next);
    //   current && current.destroy();
    //   if(next) {
    //     await next.restore();
    //   }
    // }
  }

});

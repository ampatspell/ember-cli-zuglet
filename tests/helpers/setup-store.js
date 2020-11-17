import Store from 'zuglet/store';
import User from 'zuglet/user';
import { activate, load } from 'zuglet/utils';
import { getStats } from 'zuglet/-private/stores/stats';
import environment from '../../config/environment';

let {
  dummy: {
    firebase
  }
} = environment;

class TestUser extends User {
}

class TestStore extends Store {

  options = {
    firebase,
    firestore: {
      persistenceEnabled: false
    },
    auth: {
      user: 'test-user'
    }
  }

  async load() {
    await load(this.auth);
  }

}

export const setupStore = (hooks, identifier='test') => {
  hooks.beforeEach(async function() {
    this.owner.register('model:test-user', TestUser);
    this.store = this.stores.createStore(identifier, TestStore);
    this.__cancelStoreActivation = activate(this.store);
    await this.store.load();
  });
  hooks.afterEach(function(assert) {
    let stats = getStats(this.store);
    let message = () => {
      let len = stats.promises.length;
      if(len === 0) {
        return 'no dangling promises';
      } else if(len === 1) {
        return '1 dangling promise';
      } else {
        return `${len} dangling promises`;
      }
    }
    assert.ok(!stats.hasPromises, message());
    this.__cancelStoreActivation();
  });
}

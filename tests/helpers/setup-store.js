import Store from 'zuglet/store';
import User from 'zuglet/user';
import { activate, load } from 'zuglet/utils';
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
  hooks.afterEach(function() {
    this.__cancelStoreActivation();
  });
}

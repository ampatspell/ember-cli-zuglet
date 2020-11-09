import Store from 'zuglet/store';
import User from 'zuglet/user';
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

}

export const setupStore = (hooks, identifier='test') => {
  hooks.beforeEach(function() {
    this.owner.register('model:test-user', TestUser);
    this.store = this.stores.createStore(identifier, TestStore);
  });
}

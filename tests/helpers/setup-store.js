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

let danglingPromisesMessage = len => {
  if(len === 0) {
    return 'no dangling promises';
  } else if(len === 1) {
    return '1 dangling promise';
  } else {
    return `${len} dangling promises`;
  }
}

export const setupStore = (hooks, identifier='test') => {
  hooks.beforeEach(async function() {
    this.owner.register('model:test-user', TestUser);
    this.store = this.stores.createStore(identifier, TestStore);
    this.activations = [];
    this.activate = model => {
      this.activations.push(activate(model));
    }
    this.activate(this.store);
    await this.store.load();
  });
  hooks.afterEach(function(assert) {
    let stats = getStats(this.store);
    assert.ok(!stats.hasPromises, danglingPromisesMessage(stats.promises.length));
    this.activations.forEach(cancel => cancel());
    // TODO: #31 @ampatspell assert there are no onSnapshot listeners after store is deactivated and this.activations are done
  });
}

import Store from 'zuglet/store';
import User from 'zuglet/user';
import { activate, load } from 'zuglet/utils';
import { getStats } from 'zuglet/-private/stores/stats';
import { next } from 'zuglet/-private/util/runloop';
import { A } from '@ember/array';
import environment from '../../config/environment';

let {
  dummy: {
    firebase
  }
} = environment;

class TestUser extends User {

  restored = 0;

  async restore() {
    await super.restore(...arguments);
    this.restored++;
  }

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

let pluralizeDangling = (len, singular, plural) => {
  if(len === 0) {
    return `no dangling ${plural}`;
  } else if(len === 1) {
    return `1 dangling ${singular}`;
  }
  return `${len} dangling ${plural}`;
}

export const setupStore = (hooks, identifier='test') => {
  hooks.beforeEach(async function() {
    this.stores = this.owner.lookup('zuglet:stores');
    this.owner.register('model:test-user', TestUser);
    this.store = this.stores.createStore(identifier, TestStore);
    this.activations = A();
    this.activate = model => {
      let cancel = activate(model);
      this.activations.push(cancel);
      return () => {
        cancel();
        this.activations.removeObject(cancel);
      }
    }
    this.activate(this.store);
    await this.store.load();
  });
  hooks.afterEach(async function(assert) {
    this.activations.forEach(cancel => cancel());
    this.stores.destroy();
    await next();

    let stats = getStats(this.store);
    assert.ok(!stats.hasPromises, pluralizeDangling(stats.promises.length, 'promise', 'promises'));
    assert.ok(!stats.hasObservers, pluralizeDangling(stats.observers.length, 'observer', 'observers'));
  });
}

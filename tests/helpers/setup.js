import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupStores from './setup-stores';
import setupStore from './setup-store';
import { recreateCollection } from './firebase';

const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStores(hooks);
  setupStore(hooks);
};

const setupDucks = hooks => {
  hooks.beforeEach(async function() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
  });
}

export {
  module,
  test,
  setupTest,
  setupStores,
  setupStore,
  setupStoreTest,
  setupDucks
}

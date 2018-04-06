import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupStores from './setup-stores';
import setupStore from './setup-store';

const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStores(hooks);
  setupStore(hooks);
};

export {
  module,
  test,
  setupTest,
  setupStores,
  setupStore,
  setupStoreTest
}

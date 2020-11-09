import { module, test, only, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupStore } from './setup-store';

test.only = only;
test.skip = skip;

const setupStores = hooks => {
  hooks.beforeEach(function() {
    this.stores = this.owner.lookup('zuglet:stores');
  });
  hooks.afterEach(function() {
    this.stores.destroy();
  });
}

export const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStores(hooks);
  setupStore(hooks);
}

export {
  module,
  test
}
import { module, test, only, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupStores } from './setup-stores';
import { setupStore } from './setup-store';

export const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStores(hooks);
  setupStore(hooks);
}

const credentials = {
  ampatspell: { email: 'ampatspell@gmail.com', password: 'heythere' }
};

test.only = only;
test.skip = skip;

export {
  module,
  test,
  credentials
}
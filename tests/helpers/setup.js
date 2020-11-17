import { module, test, only, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupStore } from './setup-store';
import { setupHelpers } from './setup-helpers';

export const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStore(hooks);
  setupHelpers(hooks);
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

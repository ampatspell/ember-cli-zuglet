import { module, test, only, skip } from 'qunit';
import { setupTest, setupRenderingTest } from 'ember-qunit';
import { setupStore } from './setup-store';
import { setupHelpers } from './setup-helpers';

export const setupStoreTest = hooks => {
  setupTest(hooks);
  setupStore(hooks);
  setupHelpers(hooks);
}

export const setupRenderingStoreTest = (hooks, setup=true) => {
  setupRenderingTest(hooks);
  if(setup) {
    setupStore(hooks);
    setupHelpers(hooks);
  }
}

const credentials = {
  ampatspell: { email: 'ampatspell@gmail.com', password: 'hello-world' },                // should exist
  zeeba:      { email: 'zeeba@gmail.com', password: 'R3allyS3cUr3Pas$wooooorrrd.kinda' } // should not exist
};

test.only = only;
test.skip = skip;

export {
  module,
  test,
  credentials
}

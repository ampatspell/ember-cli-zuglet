import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { all } from 'rsvp';

module('batch', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('create a batch', async function(assert) {
    let batch = this.store.batch();
    assert.ok(batch);
    assert.ok(batch._internal);
  });

});

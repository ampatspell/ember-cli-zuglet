import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { recreateCollection } from '../helpers/firebase';

module('query-observers', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  hooks.beforeEach(() => {
    this.recreate = async () => {
      await recreateCollection(this.coll);
      await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();
    };
  });

  test('observers exist', async function(assert) {
    await this.recreate();

    let query = this.store.collection('ducks').query({ type: 'array' });
    let observers = query.get('observers');
    assert.ok(observers);
  });

});

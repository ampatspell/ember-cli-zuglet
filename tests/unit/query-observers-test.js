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
    let query = this.store.collection('ducks').query({ type: 'array' });
    let observers = query.get('observers');
    assert.ok(observers);
  });

  test('observers are registered', async function(assert) {
    let query = this.store.collection('ducks').query({ type: 'array' });
    let observers = query.get('observers');
    let observer = query.observe();

    assert.ok(observers.get('lastObject') === observer);
    assert.equal(observers.get('length'), 1);

    observer.cancel();

    assert.ok(observers.get('lastObject') === undefined);
    assert.equal(observers.get('length'), 0);
  });

  test('observers promise', async function(assert) {
    let query = this.store.collection('ducks').query({ type: 'array' });
    let observers = query.get('observers');

    try {
      await observers.get('promise');
    } catch(err) {
      assert.equal(err.code, 'zuglet/observers/none');
    }

    query.observe();

    await observers.get('promise');
  });

});

import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';

module('document-observers', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  hooks.beforeEach(() => {
    this.recreate = () => this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();
  });

  test('observers exist', async function(assert) {
    await this.recreate();

    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');
    assert.ok(observers);
  });

});

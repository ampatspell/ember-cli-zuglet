import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection } from '../helpers/firebase';

module('document-load', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
  });

  test('load', async function(assert) {
    await this.recreate();
    await this.coll.doc('yellow').set({ name: 'yellow' });
    let doc = await this.store.load({ path: 'ducks/yellow' });
    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "exists": true,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isObserving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "data": {
        "name": "yellow"
      },
    });
  });

  test('load missing optional', async function(assert) {
    await this.recreate();
    let doc = await this.store.load({ path: 'ducks/yellow', optional: true });
    assert.deepEqual(doc.get('serialized'), {
      "exists": false,
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isObserving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "data": undefined
    });
  });

  test('load missing required', async function(assert) {
    await this.recreate();
    try {
      await this.store.load({ path: 'ducks/yellow' });
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'zuglet/document-missing');
    }
  });

});

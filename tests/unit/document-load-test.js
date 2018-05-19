import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitFor } from '../helpers/firebase';
import { typeOf } from '@ember/utils';

module('document-load', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('load', async function(assert) {
    await this.recreate();
    await this.coll.doc('yellow').set({ name: 'yellow' });

    let doc = await this.store.doc('ducks/yellow').load();

    assert.deepEqual(doc.get('serialized'), {
      "isNew": false,
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "exists": true,
      "isError": false,
      "isDirty": false,
      "isLoaded": true,
      "isLoading": false,
      "isSaving": false,
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
    let doc = await this.store.doc('ducks/yellow').load({ optional: true });
    assert.deepEqual(doc.get('serialized'), {
      "isNew": false,
      "exists": false,
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "isDirty": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "data": {}
    });
  });

  test('load missing required', async function(assert) {
    await this.recreate();
    try {
      await this.store.doc('ducks/yellow').load();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'zuglet/document-missing');
    }
  });

  test('document with server timestamp', async function(assert) {
    await this.recreate();
    let doc = this.store.doc('ducks/yellow').new();
    doc.set('data.name', 'duck');
    doc.set('data.created_at', this.store.serverTimestamp());
    assert.deepEqual(doc.get('data.serialized'), {
      "created_at": "timestamp:server",
      "name": "duck"
    });

    let created = doc.get('data.created_at');
    assert.ok(created);

    await doc.save();

    assert.deepEqual(doc.get('data.serialized'), {
      "created_at": "timestamp:server",
      "name": "duck"
    });

    await doc.reload();

    let date = doc.get('data.created_at.date');

    assert.ok(created !== date);
    assert.ok(typeOf(date) === 'date');

    assert.deepEqual(doc.get('data.serialized'), {
      "created_at": date,
      "name": "duck"
    });
  });

  test('document with estimate', async function(assert) {
    await this.recreate();

    let doc = this.store.doc('ducks/yellow').new({
      name: 'duck',
      created_at: this.store.serverTimestamp()
    });

    let observer = doc.observe();

    assert.deepEqual(doc.get('data.serialized'), {
      "created_at": "timestamp:server",
      "name": "duck"
    });

    doc.save();
    await waitFor(() => !doc.get('data.created_at.isServerTimestamp'));

    let preview = doc.get('data.serialized');
    assert.ok(preview.created_at);
    assert.ok(typeOf(preview.created_at) === 'date');

    observer.cancel();
  });

});

import { module, test, setupStoreTest } from '../helpers/setup';

module('store / document', function(hooks) {
  setupStoreTest(hooks);

  test(`create new document state`, function(assert) {
    let doc = this.store.doc('ducks/yellow').new();
    assert.ok(doc);
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: undefined,
      isNew: true,
      isDirty: true,
      isLoaded: false,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {}
    });
  });

  test(`force load new missing document`, async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();
    let doc = await ref.new({ ok: true }).load({ force: true });
    assert.ok(doc);
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: false,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
        ok: true
      }
    });
  });

  test('load missing required document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();
    let doc = await ref.existing().load();
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: false,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
      }
    });
  });

  test('load existing document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.new({ name: 'yellow' }).save();

    let doc = ref.existing();

    let promise = doc.load();
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: undefined,
      isNew: false,
      isDirty: true,
      isLoaded: false,
      isLoading: true,
      isSaving: false,
      isError: false,
      error: null,
      data: {}
    });
    await promise;

    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: true,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
        name: 'yellow'
      }
    });
  });

  test('save new document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    let doc = ref.new({ name: 'yellow' });

    let promise = doc.save();
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: undefined,
      isNew: true,
      isDirty: true,
      isLoaded: false,
      isLoading: false,
      isSaving: true,
      isError: false,
      error: null,
      data: {
        name: 'yellow'
      }
    });
    await promise;

    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: true,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
        name: 'yellow'
      }
    });
  });

  test(`passive document`, function(assert) {
    let doc = this.store.doc('ducks/yellow').new();
    assert.strictEqual(doc.isPassive, false);
    let ret = doc.passive();
    assert.ok(doc === ret);
    assert.strictEqual(doc.isPassive, true);
  });

  test('delete document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.new({ name: 'yellow' }).save();

    let doc = await ref.load();

    let promise = doc.delete();
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: true,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: true,
      isError: false,
      error: null,
      data: {
        name: 'yellow'
      }
    });
    await promise;

    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: false,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
        name: 'yellow'
      }
    });
  });

  test(`load and reload`, async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.new({ name: 'yellow' }).save();

    let doc = await ref.load();
    assert.strictEqual(doc.isLoaded, true);
    assert.strictEqual(doc.isLoading, false);

    let promise = doc.load();
    assert.strictEqual(doc.isLoading, false);
    await promise;
    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.exists, true);

    await ref.delete();

    promise = doc.reload();
    assert.strictEqual(doc.isLoading, true);
    await promise;
    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.exists, false);
    assert.deepEqual(doc.data, { name: 'yellow' });
  });

  test('save with token', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    let doc = ref.new({ name: 'yellow' });
    await doc.save({ token: true });

    assert.ok(doc.token);

    let data = await ref.data();
    assert.deepEqual(data, {
      _token: doc.token,
      name: 'yellow',
    });

    await ref.save({ name: 'green' }, { merge: true });

    await doc.reload();
    assert.deepEqual(doc.data, {
      name: 'yellow'
    });

    await ref.save({ name: 'green', _token: 'another' }, { merge: true });

    await doc.reload();
    assert.deepEqual(doc.data, {
      name: 'green'
    });
  });

});

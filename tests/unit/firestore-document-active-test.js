import { module, test, setupStoreTest } from '../helpers/setup';
import { defer } from 'zuglet/utils';
import { isServerTimestamp, isTimestamp } from 'zuglet/-private/util/types';

module('firestore / document / active', function(hooks) {
  setupStoreTest(hooks);

  test('activate saved document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ message: 'hey' });

    let doc = ref.new({ name: 'yellow' });
    await doc.save({ merge: true });

    this.activate(doc);
    await doc.promise.cached;

    assert.deepEqual(doc.data, {
      name: 'yellow',
      message: 'hey'
    });
  });

  test('activate existing document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    this.activate(doc);

    assert.strictEqual(doc.isLoading, true);
    assert.strictEqual(doc.isLoaded, false);

    await doc.promise.cached;

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, true);

    assert.deepEqual(doc.data, {
      name: 'yellow'
    });
  });

  test('activate passive existing document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing().passive();
    this.activate(doc);

    assert.strictEqual(doc.isLoading, true);
    assert.strictEqual(doc.isLoaded, false);

    await doc.promise.cached;

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, true);

    assert.deepEqual(doc.data, {
      name: 'yellow'
    });
  });

  test('activate new', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    let doc = await ref.new({ name: 'yellow' }).passive();

    this.activate(doc);

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, false);
  });

  test('on data', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    let deferred = defer();
    doc.onData(() => {
      assert.deepEqual(doc.data, { name: 'yellow' });
      deferred.resolve();
    });

    this.activate(doc);
    await deferred.promise;
  });

  test('on delete', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    let deferred = defer();
    doc.onDeleted(() => {
      assert.ok(true);
      deferred.resolve();
    });

    this.activate(doc);
    await ref.delete();
    await deferred.promise;
  });

  test('listener cancel', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();

    let invocations = 0;
    let cancel = doc.onData(() => {
      invocations++;
    });

    this.activate(doc);
    await doc.promise.cached;

    let snapshot;

    snapshot = invocations;
    await doc.reload();
    assert.ok(snapshot !== invocations);

    assert.ok(cancel());

    snapshot = invocations;
    await doc.reload();
    assert.ok(snapshot === invocations);

    assert.ok(!cancel());
  });

  test('save with token and server timestamp', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    let doc = ref.new({ name: 'yellow', createdAt: this.store.serverTimestamp });
    await doc.save({ token: true });

    assert.ok(isServerTimestamp(doc.data.createdAt));

    this.activate(doc);

    let deferred = defer();
    let cancel = doc.onData(() => deferred.resolve());
    await deferred.promise;

    assert.ok(isTimestamp(doc.data.createdAt));

    cancel();
  });

  test('new documents are resolved', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    let doc = ref.new({ name: 'yellow', createdAt: this.store.serverTimestamp });
    this.activate(doc);

    let res = await doc.promise.remote;
    assert.ok(res === doc);
  });

  test('new documents after save resolves', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    let doc = ref.new({ name: 'yellow', createdAt: this.store.serverTimestamp });
    this.activate(doc);

    await doc.save();

    let res = await doc.promise.remote;
    assert.ok(res === doc);
  });

  test('document data map set to null', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    let doc = ref.new({ map: { ok: true } });
    this.activate(doc);

    await doc.save();

    let promise = doc.waitFor(doc => doc.data.map === null);
    await ref.save({ map: null });
    await promise;

    assert.deepEqual(doc.serialized.data, { map: null });
  });

  test('doc data set to empty object', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    let doc = ref.new({ map: { ok: true } });
    await doc.save();

    doc.data = {};

    assert.deepEqual(doc.serialized.data, {});
    assert.deepEqual(doc._data, {});
    assert.strictEqual(doc.isDirty, true);
    await doc.save();

    let loaded = await ref.load();
    assert.deepEqual(loaded.serialized.data, {});
  });

});

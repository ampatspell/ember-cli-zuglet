import { module, test, setupStoreTest } from '../helpers/setup';

module('storage / reference', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    this.bucket = this.store.options.firebase.storageBucket;
    assert.ok(this.bucket);
    this.storage = this.store.storage;
    this.putString = async (ref, data = 'hey there') => {
      let task = ref.put({
        type: 'string',
        format: 'raw',
        data,
        metadata: {
          contentType: 'text/plain'
        }
      });
      await task.promise;
    }
  });

  test('create ref with path', async function(assert) {
    let ref = this.storage.ref('ducks/hello');
    assert.deepEqual(ref.serialized, {
      bucket: this.bucket,
      name: 'hello',
      path: 'ducks/hello'
    });
  });

  test('create ref with url', async function(assert) {
    let ref = this.storage.ref({ url: 'gs://quatsch-another.appspot.com/ducks/hello' });
    assert.deepEqual(ref.serialized, {
      bucket: 'quatsch-another.appspot.com',
      name: 'hello',
      path: 'ducks/hello'
    });
  });

  test('toJSON', async function(assert) {
    let json = this.storage.ref('ducks/hello').toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        bucket: this.bucket,
        name: 'hello',
        path: 'ducks/hello'
      }
    });
    assert.ok(json.instance.startsWith('StorageReference::ember'));
  });

  test('toStringExtension', function(assert) {
    let string = this.storage.ref('ducks/hello').toStringExtension();
    assert.deepEqual(string, 'ducks/hello');
  });

  test('props', function(assert) {
    let ref = this.storage.ref('ducks/hello');
    assert.strictEqual(ref.name, 'hello');
    assert.strictEqual(ref.path, 'ducks/hello');
    assert.strictEqual(ref.bucket, this.bucket);
  });

  test('url for missing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });

    try {
      await ref.url();
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, `Firebase Storage: Object 'hello' does not exist. (storage/object-not-found)`);
      assert.strictEqual(err.code, `storage/object-not-found`);
    }
  });

  test('url for existing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await this.putString(ref);

    let url = await ref.url();
    assert.ok(url.startsWith(`https://firebasestorage.googleapis.com/v0/b/${this.bucket}/o/hello?alt=media&token=`));
  });

  test('metadata for missing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });

    try {
      await ref.metadata();
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, `Firebase Storage: Object 'hello' does not exist. (storage/object-not-found)`);
      assert.strictEqual(err.code, `storage/object-not-found`);
    }
  });

  test('metadata for missing optional file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });

    let metadata = await ref.metadata({ optional: true });
    assert.strictEqual(metadata, undefined);
  });

  test('metadata for existing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await this.putString(ref);
    await ref.update({
      customMetadata: { name: 'duck' }
    })

    let metadata = await ref.metadata();

    assert.deepEqual(metadata, {
      bucket: this.bucket,
      cacheControl: undefined,
      contentDisposition: `inline; filename*=utf-8''hello`,
      contentEncoding: 'identity',
      contentLanguage: undefined,
      contentType: 'text/plain',
      customMetadata: {
        name: 'duck'
      },
      fullPath: 'hello',
      generation: metadata.generation,
      md5Hash: metadata.md5Hash,
      metageneration: '2',
      name: 'hello',
      size: 9,
      timeCreated: metadata.timeCreated,
      type: 'file',
      updated: metadata.updated
    });

    assert.ok(typeof metadata.generation === 'string');
    assert.ok(typeof metadata.md5Hash === 'string');
    assert.ok(metadata.timeCreated instanceof Date);
    assert.ok(metadata.updated instanceof Date);
  });

  test('update metadata for missing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });
    try {
      await ref.update({ contentType: 'duck/fancy' });
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, `Firebase Storage: Object 'hello' does not exist. (storage/object-not-found)`);
      assert.strictEqual(err.code, `storage/object-not-found`);
    }
  });

  test('update metadata', async function(assert) {
    let ref = this.storage.ref('hello');
    await this.putString(ref);
    await ref.update({ contentType: 'duck/fancy', customMetadata: { name: 'duck' } });
    let metadata = await ref.metadata();
    assert.strictEqual(metadata.contentType, 'duck/fancy');
    assert.deepEqual(metadata.customMetadata, {
      name: 'duck'
    });
  });

  test('delete missing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });
    try {
      await ref.delete();
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, `Firebase Storage: Object 'hello' does not exist. (storage/object-not-found)`);
      assert.strictEqual(err.code, `storage/object-not-found`);
    }
  });

  test('delete optional missing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });

    let deleted = await ref.delete({ optional: true });
    assert.strictEqual(deleted, false);
  });

  test('delete existing file', async function(assert) {
    let ref = this.storage.ref('hello');
    await this.putString(ref);

    let deleted = await ref.delete();
    assert.strictEqual(deleted, true);
  });

});

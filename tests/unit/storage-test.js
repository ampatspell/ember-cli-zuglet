import { module, test, setupStoreTest } from '../helpers/setup';

module('storage', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    this.bucket = this.store.options.firebase.storageBucket;
    assert.ok(this.bucket);
  });

  test('bucket', async function(assert) {
    let bucket = this.store.storage.bucket;
    assert.strictEqual(bucket, this.bucket);
  });

  test('serialized', function(assert) {
    assert.deepEqual(this.store.storage.serialized, {
      bucket: this.bucket
    });
  });

  test('toJSON', function(assert) {
    let json = this.store.storage.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        bucket: this.bucket
      }
    });
    assert.ok(json.instance.startsWith('Storage::ember'));
  });

  test('toStringExtension', function(assert) {
    let string = this.store.storage.toStringExtension();
    assert.strictEqual(string, this.bucket);
  });

});

import { module, test, setupStoreTest } from '../helpers/setup';

module('storage / reference / list', function(hooks) {
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
    };
    this.putFiles = async () => {
      let files = this.storage.ref('files');
      let put = path => this.putString(files.ref(path));
      await Promise.all([
        put('one'),
        put('two'),
        put('three'),
        put('four/five')
      ]);
      return files;
    }
  });

  test('list fails', async function(assert) {
    try {
      await this.storage.ref('foof').list();
    } catch(err) {
      assert.strictEqual(
        err.message,
        `Firebase Storage: User does not have permission to access 'foof'. (storage/unauthorized)`
      );
    }
  });

  test('list max results', async function(assert) {
    let files = await this.putFiles();
    let results = await files.list({ maxResults: 2 });
    assert.ok(results.nextPageToken);
    assert.deepEqual(results.items.map(item => item.path), [
      'files/one'
    ]);
    assert.deepEqual(results.prefixes.map(item => item.path), [
      'files/four'
    ]);
  });

  test('list', async function(assert) {
    let files = await this.putFiles();
    let results = await files.list();
    assert.strictEqual(results.nextPageToken, null);
    assert.deepEqual(results.items.map(item => item.path), [
      'files/one',
      'files/three',
      'files/two'
    ]);
    assert.deepEqual(results.prefixes.map(item => item.path), [
      "files/four"
    ]);
  });

  test('list all', async function(assert) {
    let files = await this.putFiles();
    let results = await files.list();
    assert.strictEqual(results.nextPageToken, null);
    assert.deepEqual(results.items.map(item => item.path), [
      'files/one',
      'files/three',
      'files/two'
    ]);
    assert.deepEqual(results.prefixes.map(item => item.path), [
      'files/four'
    ]);
  });

});

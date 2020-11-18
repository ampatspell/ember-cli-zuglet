import { module, test, setupStoreTest } from '../helpers/setup';

module('storage / reference / put', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    this.bucket = this.store.options.firebase.storageBucket;
    assert.ok(this.bucket);
    this.storage = this.store.storage;
    this.fetchText = async ref => {
      let url = await ref.url();
      let res = await fetch(url);
      return await res.text();
    }
  });

  test('put raw string', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'raw',
      data: 'hey there raw',
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there raw');
  });

  test('put base64 string', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'base64',
      data: btoa('hey there base64'),
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there base64');
  });

  test('put base64-url string', async function(assert) {
    let ref = this.storage.ref('hello');
    // TODO: this is plain base64
    let task = ref.put({
      type: 'string',
      format: 'base64-url',
      data: btoa('hey there base64-url'),
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there base64-url');
  });

  test('put data-url string', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'data-url',
      data: `data:text/plain;base64,${btoa('hey there data-url')}`,
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there data-url');
  });

  test('put blob', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'data',
      data: new Blob([ 'hey there blob' ]),
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there blob');
  });

  test('put type defaults to data', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      data: new Blob([ 'hey there blob' ]),
      metadata: {
        contentType: 'text/plain'
      }
    });
    await task.promise;
    let body = await this.fetchText(ref);
    assert.strictEqual(body, 'hey there blob');
  });

});

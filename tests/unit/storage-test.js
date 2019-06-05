import { module, test, setupStoreTest } from '../helpers/setup';
import { run } from '@ember/runloop';
import { resolve } from 'rsvp';
import { typeOf } from '@ember/utils';
import getParams from '../helpers/query';

let params = getParams();
let disabled = params['no-auth'] || params['no-storage'];

module('storage', function(hooks) {
  setupStoreTest(hooks);

  if(disabled) {
    test('disabled', function(assert) {
      assert.ok(true);
    });
    return;
  }

  hooks.beforeEach(function() {
    this.storage = this.store.get('storage');

    this.signIn = () => this.store.get('auth.methods.anonymous').signIn();

    this.ref = this.storage.ref({ path: 'hello' });

    this.put = () => this.ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      }
    });

    this._put = (path='hello') => {
      let storage = this.store._internal.app.storage();
      let ref = storage.ref(path);
      return resolve(ref.putString('hello world', 'raw', { contentType: 'text/plain' }));
    }
  });

  test('storage exists', function(assert) {
    let storage = this.storage;
    assert.ok(storage);
    assert.ok(storage._internal);
  });

  test('storage is destroyed when store is', function(assert) {
    let storage = this.storage;
    run(() => this.store.destroy());
    assert.ok(storage.isDestroyed);
  });

  test('create ref', async function(assert) {
    let ref = this.storage.ref({ path: 'hello' });
    assert.ok(ref);
    assert.ok(ref._internal);
    let bucket = ref.get('bucket');
    assert.equal(bucket, this.store.get('options.firebase.storageBucket'));
    assert.deepEqual(ref.get('serialized'), {
      "bucket": bucket,
      "fullPath": "hello",
      "name": "hello"
    });
  });

  test('create ref from url', async function(assert) {
    let ref = this.storage.ref({ url: 'gs://foo/bar' });
    assert.ok(ref);
    assert.ok(ref._internal);
    assert.deepEqual(ref.get('serialized'), {
      "bucket": "foo",
      "fullPath": "bar",
      "name": "bar"
    });
  });

  test('ref has metadata', function(assert) {
    let ref = this.storage.ref('hello');
    let metadata = ref.get('metadata');
    assert.ok(metadata);
    assert.ok(metadata._internal);
  });

  test('put string', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'hello' });

    let task = ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      }
    });

    assert.ok(task);
    assert.equal(task.get('type'), 'string');

    let promise = task.get('promise');
    assert.ok(promise);

    await promise;
  });

  test('put blob', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'hello' });

    let task = ref.put({
      type: 'data',
      data: new Blob([ 'hello world as a blob' ]),
      metadata: {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      }
    });

    assert.ok(task);
    assert.equal(task.get('type'), 'data');

    let promise = task.get('promise');
    assert.ok(promise);

    await promise;
  });

  test('put blob with thenable', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'hello' });

    let task = ref.put({
      type: 'data',
      data: new Blob([ 'hello world as a blob' ]),
      metadata: {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      }
    });

    assert.ok(typeof task.then === 'function');
    assert.ok(typeof task.catch === 'function');
    assert.ok(typeof task.finally === 'function');

    await task;

    assert.deepEqual(task.get('serialized'), {
      "bytesTransferred": 21,
      "error": null,
      "isCompleted": true,
      "isError": false,
      "isRunning": false,
      "percent": 100,
      "totalBytes": 21,
      "type": "data"
    });
  });

  test('settle', async function(assert) {
    await this.signIn();
    let task = this.put();

    await this.store.settle();

    assert.ok(task.get('isCompleted'));
    assert.ok(this.storage.get('tasks.length') === 0);
  });

  test('running tasks are registered in storage', async function(assert) {
    await this.signIn();
    let internal = this.storage.get('_internal.queue.operations');
    let root = this.store.get('_internal.queue.operations');

    let tasks = this.storage.get('tasks');

    assert.ok(internal.get('length') === 0);
    assert.ok(root.get('length') === 0);

    assert.ok(tasks.get('length') === 0);

    let task = this.put();

    assert.ok(internal.get('length') === 1);
    assert.ok(root.get('length') === 1);

    assert.ok(tasks.get('length') === 1);
    assert.ok(tasks.includes(task));

    let r = await task.get('promise');
    assert.ok(r === undefined);

    assert.ok(tasks.get('length') === 0);

    assert.ok(internal.get('length') === 0);
    assert.ok(root.get('length') === 0);
  });

  test('task has ref', async function(assert) {
    await this.signIn();
    let task = this.put();
    assert.ok(task.get('ref') === this.ref);
  });

  test('task properties', async function(assert) {
    await this.signIn();
    let task = this.put();

    assert.deepEqual(task.get('serialized'), {
      "bytesTransferred": 0,
      "error": null,
      "isCompleted": false,
      "isError": false,
      "isRunning": true,
      "percent": 0,
      "totalBytes": 27,
      "type": "string"
    });

    await task.get('promise');

    assert.deepEqual(task.get('serialized'), {
      "bytesTransferred": 27,
      "error": null,
      "isCompleted": true,
      "isError": false,
      "isRunning": false,
      "percent": 100,
      "totalBytes": 27,
      "type": "string"
    });

    let ref = await task.get('ref').load({ url: true });
    assert.ok(ref.get('url.value'));
  });

  test('task upload error', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'forbidden/hello' });

    let task = ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain',
      }
    });

    let error;
    await task.get('promise').catch(err => error = err);

    assert.deepEqual(task.get('serialized'), {
      "bytesTransferred": 0,
      "error": error,
      "isCompleted": true,
      "isError": true,
      "isRunning": false,
      "percent": 0,
      "totalBytes": 27,
      "type": "string"
    });

    assert.ok(error);
    assert.ok(error.code === 'storage/unauthorized');
  });

  test('ref load resolves with ref', async function(assert) {
    await this.signIn();
    await this._put();

    let ref = this.storage.ref({ path: 'hello' });
    let result = await ref.load();
    assert.ok(ref === result);
  });

  test('ref load reject', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });
    try {
      await ref.load();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.ok(true);
      assert.equal(err.code, 'storage/object-not-found');
    }
  });

  test('ref load optional', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });

    assert.deepEqual(ref.get('metadata.serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });

    let result = await ref.load({ optional: true });
    assert.ok(result === ref);

    assert.deepEqual(ref.get('metadata.serialized'), {
      "error": null,
      "isError": false,
      "exists": false,
      "isLoaded": true,
      "isLoading": false
    });
  });

  test('ref has metadata', async function(assert) {
    let ref = this.storage.ref({ path: 'missing' });
    let metadata = ref.get('metadata');
    assert.ok(metadata);
    assert.ok(metadata._internal);
    assert.ok(metadata.get('ref') === ref);

    assert.deepEqual(metadata.get('serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoading": false,
      "isLoaded": false
    });
  });

  test('metadata is destroyed with ref', async function(assert) {
    let ref = this.storage.ref({ path: 'missing' });
    let metadata = ref.get('metadata');
    run(() => ref.destroy());
    assert.ok(metadata.isDestroyed);
  });

  test('load metadata', async function(assert) {
    await this.signIn();
    await this._put();

    let ref = this.storage.ref({ path: 'hello' });
    let metadata = ref.get('metadata');

    assert.deepEqual(metadata.get('serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });

    await metadata.load();

    assert.deepEqual(metadata.get('serialized'), {
      "contentType": "text/plain",
      "error": null,
      "isError": false,
      "exists": true,
      "isLoaded": true,
      "isLoading": false,
      "name": "hello",
      "size": 11
    });
  });

  test('load optional metadata for missing', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });
    let metadata = ref.get('metadata');

    assert.deepEqual(metadata.get('serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });

    await metadata.load({ optional: true });

    assert.deepEqual(metadata.get('serialized'), {
      "error": null,
      "isError": false,
      "exists": false,
      "isLoaded": true,
      "isLoading": false
    });
  });

  test('load metadata for missing', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });
    let metadata = ref.get('metadata');

    assert.deepEqual(metadata.get('serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });

    try {
      await metadata.load();
    } catch(err) {
      assert.equal(err.code, 'storage/object-not-found');
    }

    let error = metadata.get('error');

    assert.ok(error);

    assert.deepEqual(metadata.get('serialized'), {
      "error": error,
      "isError": true,
      "exists": false,
      "isLoaded": true,
      "isLoading": false
    });
  });

  test('metadata load succeeds', async function(assert) {
    await this.signIn();
    await this._put();

    let ref = this.storage.ref({ path: 'hello' });
    let metadata = ref.get('metadata');

    await metadata.load();

    assert.ok(metadata.get('raw'));

    assert.deepEqual(metadata.get('serialized'), {
      "isLoading": false,
      "isLoaded": true,
      "exists": true,
      "isError": false,
      "error": null,
      "name": "hello",
      "size": 11,
      "contentType": "text/plain"
    });

    assert.ok(typeOf(metadata.get('createdAt')) === 'date');
  });

  test('ref download url', async function(assert) {
    await this.signIn();
    await this._put();

    let ref = this.storage.ref({ path: 'hello' });

    assert.equal(ref.get('url.value'), undefined);

    await ref.load({ url: true });

    assert.ok(ref.get('url.value').includes('/o/hello'));
  });

  test('metadata update', async function(assert) {
    await this.signIn();
    await this._put();

    let ref = this.storage.ref({ path: 'hello' });
    let metadata = ref.get('metadata');

    await metadata.update({ contentType: 'text/plainest', customMetadata: { hello: 'world' } });

    assert.deepEqual(metadata.get('serialized'), {
      "isLoading": false,
      "contentType": "text/plainest",
      "error": null,
      "isError": false,
      "exists": true,
      "isLoaded": true,
      "name": "hello",
      "size": 11,
      "customMetadata": {
        "hello": "world"
      }
    });
  });

  test('metadata update fails', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });
    let metadata = ref.get('metadata');

    try {
      await metadata.update({ contentType: 'text/plainest', customMetadata: { hello: 'world' } });
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'storage/object-not-found');
      assert.deepEqual(metadata.get('serialized'), {
        "exists": false,
        "isLoaded": true,
        "isLoading": false,
        "isError": true,
        error: err
      });
    }
  });

  test('ref as a string', async function(assert) {
    let images = this.storage.ref('images/hello');
    assert.equal(images.get('fullPath'), 'images/hello');
  });

  test('ref child', async function(assert) {
    let images = this.storage.ref('images');
    let image = images.child('image');
    assert.equal(image.get('fullPath'), 'images/image');
  });

  test('ref ref', async function(assert) {
    let images = this.storage.ref('images');
    let image = images.ref('image');
    assert.equal(image.get('fullPath'), 'images/image');
  });

  test('ref parent', async function(assert) {
    let image = this.storage.ref('images/image');
    let images = image.get('parent');
    assert.equal(images.get('fullPath'), 'images');
  });

  test('url has ref', async function(assert) {
    let ref = this.storage.ref({ path: 'hello' });
    assert.ok(ref.get('url.ref') === ref);
  });

  test('load url', async function(assert) {
    await this.signIn();
    await this._put();
    let ref = this.storage.ref({ path: 'hello' });

    assert.deepEqual(ref.get('url.serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false,
      "value": undefined
    });

    let promise = ref.load({ url: true });

    assert.deepEqual(ref.get('url.serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": true,
      "value": undefined
    });

    let result = await promise;

    assert.ok(result === ref);

    assert.ok(ref.get('url.value').startsWith('https://firebasestorage.googleapis.com/'));

    assert.deepEqual(ref.get('url.serialized'), {
      "error": null,
      "isError": false,
      "exists": true,
      "isLoaded": true,
      "isLoading": false,
      "value": result.get('url.value')
    });
  });

  test('url load reject', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref({ path: 'missing' });
    try {
      await ref.load({ url: true, metadata: false });
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.ok(true);
      assert.equal(err.code, 'storage/object-not-found');
    }
  });

  test('delete existing', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref('hello');
    await ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain'
      }
    });

    await ref.delete();

    try {
      await ref.load();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'storage/object-not-found');
    }
  });

  test('delete missing rejects', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });

    try {
      await ref.delete();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'storage/object-not-found');
    }
  });

  test('delete missing optional resolves', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref('hello');
    await ref.delete({ optional: true });
    await ref.delete({ optional: true });

    assert.ok(true);
  });

  test('metadata after delete is unset', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref('hello');

    await ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain'
      }
    });

    await ref.load({ optional: true });

    assert.deepEqual(ref.get('metadata.serialized'), {
      "contentType": "text/plain",
      "name": "hello",
      "size": 27,
      "error": null,
      "isError": false,
      "exists": true,
      "isLoaded": true,
      "isLoading": false
    });

    assert.deepEqual(ref.get('url.serialized'), {
      "error": null,
      "exists": true,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "value": ref.get('url.value')
    });

    assert.ok(ref.get('url.value'));

    await ref.delete();

    assert.deepEqual(ref.get('metadata.serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });

    assert.deepEqual(ref.get('url.serialized'), {
      "error": null,
      "exists": undefined,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "value": ref.get('url.value')
    });

    assert.equal(ref.get('url.value'), undefined);
  });

  test('metadata after delete missing is unset', async function(assert) {
    await this.signIn();

    let ref = this.storage.ref('hello');

    await ref.put({
      type: 'string',
      data: 'hello world as a raw string',
      format: 'raw',
      metadata: {
        contentType: 'text/plain'
      }
    });

    await ref.load({ optional: true });

    assert.deepEqual(ref.get('metadata.serialized'), {
      "contentType": "text/plain",
      "name": "hello",
      "size": 27,
      "error": null,
      "isError": false,
      "exists": true,
      "isLoaded": true,
      "isLoading": false
    });

    await this.storage.ref('hello').delete();
    await ref.delete({ optional: true });

    assert.deepEqual(ref.get('metadata.serialized'), {
      "error": null,
      "isError": false,
      "exists": undefined,
      "isLoaded": false,
      "isLoading": false
    });
  });

});

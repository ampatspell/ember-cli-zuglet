import { module, test, setupStoreTest } from '../helpers/setup';

module('storage / task', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.storage = this.store.storage;
  });

  test('inactivate task serialized', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'raw',
      data: 'hey task',
      metadata: {
        contentType: 'text/plain'
      }
    });

    assert.deepEqual(task.serialized, {
      data: 'hey task',
      error: null,
      isCompleted: false,
      isError: false,
      isRunning: true,
      metadata: {
        contentType: 'text/plain'
      },
      path: 'hello',
      progress: 0,
      total: null,
      transferred: null,
      type: 'string'
    });

    await task.promise;

    let serialized = task.serialized;
    let { metadata } = serialized;
    assert.deepEqual(serialized, {
      data: 'hey task',
      error: null,
      isCompleted: false,
      isError: false,
      isRunning: true,
      metadata: {
        bucket: metadata.bucket,
        cacheControl: undefined,
        contentDisposition: "inline; filename*=utf-8''hello",
        contentEncoding: 'identity',
        contentLanguage: undefined,
        contentType: 'text/plain',
        customMetadata: undefined,
        fullPath: 'hello',
        generation: metadata.generation,
        md5Hash: metadata.md5Hash,
        metageneration: '1',
        name: 'hello',
        size: 8,
        timeCreated: metadata.timeCreated,
        type: 'file',
        updated: metadata.updated
      },
      path: 'hello',
      progress: 100,
      total: 8,
      transferred: 8,
      type: 'string'
    });

    assert.ok(typeof metadata.generation === 'string');
    assert.ok(typeof metadata.md5Hash === 'string');
    assert.ok(metadata.timeCreated instanceof Date);
    assert.ok(metadata.updated instanceof Date);
  });

  test('toJSON', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'raw',
      data: 'hey task',
      metadata: {
        contentType: 'text/plain'
      }
    });

    let json = task.toJSON();
    assert.ok(json.instance.startsWith('StorageTask::ember'));
    assert.strictEqual(json.serialized.path, 'hello');
    assert.deepEqual(json.serialized.metadata, {
      contentType: 'text/plain'
    });

    await task.promise;
  });

  test('toStringExtension', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'raw',
      data: 'hey task',
      metadata: {
        contentType: 'text/plain'
      }
    });

    let string = task.toStringExtension();
    assert.strictEqual(string, 'hello');

    await task.promise;
  });

  test('active task', async function(assert) {
    let ref = this.storage.ref('hello');
    let task = ref.put({
      type: 'string',
      format: 'raw',
      data: 'hey task',
      metadata: {
        contentType: 'text/plain'
      }
    });

    this.activate(task);

    assert.ok(task._taskObserver);
    await task.promise;
    assert.ok(!task._taskObserver);
  });

});

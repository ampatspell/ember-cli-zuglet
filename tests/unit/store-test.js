import { module, test, setupStoreTest } from '../helpers/setup';
import { isServerTimestamp } from 'zuglet/-private/util/object-to-json';

module('store', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    this.projectId = this.store.options.firebase.projectId;
    assert.ok(this.projectId);
  });

  test('serialized', function(assert) {
    assert.deepEqual(this.store.serialized, {
      identifier: 'test',
      projectId: this.projectId
    });
  });

  test('toJSON', function(assert) {
    let json = this.store.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        identifier: 'test',
        projectId: this.projectId
      }
    });
    assert.ok(json.instance.startsWith('TestStore::ember'));
  });

  test('toStringExtension', function(assert) {
    assert.strictEqual(this.store.toStringExtension(), this.projectId);
  });

  test('projectId', function(assert) {
    assert.strictEqual(this.store.projectId, this.projectId);
  });

  test('dashboard', function(assert) {
    assert.strictEqual(
      this.store.dashboard,
      `https://console.firebase.google.com/u/0/project/${this.projectId}/overview`
    );
  });

  test('server timestamp', function(assert) {
    let timestamp = this.store.serverTimestamp;
    assert.ok(isServerTimestamp(timestamp));
  });

  test('models exist', function(assert) {
    let instance = this.store.models;
    assert.ok(instance);
    assert.ok(instance === this.store.models);
  });

  test('auth exist', function(assert) {
    let instance = this.store.auth;
    assert.ok(instance);
    assert.ok(instance === this.store.auth);
  });

  test('storage exist', function(assert) {
    let instance = this.store.storage;
    assert.ok(instance);
    assert.ok(instance === this.store.storage);
  });

  test('functions exist', function(assert) {
    let instance = this.store.functions;
    assert.ok(instance);
    assert.ok(instance === this.store.functions);
  });

});

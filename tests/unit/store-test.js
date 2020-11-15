import { module, test, setupStoreTest } from '../helpers/setup';

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

});

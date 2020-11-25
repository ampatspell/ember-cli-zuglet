import { module, test, setupStoreTest } from '../helpers/setup';

module('functions', function(hooks) {
  setupStoreTest(hooks);

  test('call', async function(assert) {
    let result = await this.store.functions.call('echo', { ok: true });
    assert.deepEqual(result, {
      data: {
        data: {
          ok: true
        },
        uid: null
      }
    });
  });

  test('region returns default region', function(assert) {
    let region = this.store.functions.region();
    assert.strictEqual(region.identifier, 'us-central1');
  });

  test('custom region', function(assert) {
    let region = this.store.functions.region('duckland-north1');
    assert.strictEqual(region.identifier, 'duckland-north1');
  });

  test('serialized', function(assert) {
    assert.deepEqual(this.store.functions.serialized, {
      region: 'us-central1'
    });
  });

  test('toJSON', function(assert) {
    let json = this.store.functions.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        region: 'us-central1'
      }
    });
    assert.ok(json.instance.startsWith('Functions::ember'));
  });

  test('toStringExtension', function(assert) {
    assert.strictEqual(this.store.functions.toStringExtension(), 'us-central1');
  });

});

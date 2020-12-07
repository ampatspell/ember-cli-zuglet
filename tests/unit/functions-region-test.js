import { module, test, setupStoreTest } from '../helpers/setup';

module('functions / region', function(hooks) {
  setupStoreTest(hooks);

  test('call', async function(assert) {
    let result = await this.store.functions.region('us-central1').call('echo', { ok: true });
    assert.deepEqual(result, {
      data: {
        data: {
          ok: true
        },
        uid: null
      }
    });
  });

  test('serialized', function(assert) {
    assert.deepEqual(this.store.functions.region().serialized, {
      identifier: 'us-central1'
    });
  });

  test('toJSON', function(assert) {
    let json = this.store.functions.region().toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        identifier: 'us-central1'
      }
    });
    assert.ok(json.instance.startsWith('zuglet@store/functions/region::ember'));
  });

  test('toStringExtension', function(assert) {
    assert.strictEqual(this.store.functions.region().toStringExtension(), 'us-central1');
  });

});

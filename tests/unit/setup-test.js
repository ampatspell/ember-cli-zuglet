import { module, test, setupStoreTest } from '../helpers/setup';
import { isActivated } from 'zuglet/utils';
import EmberObject from '@ember/object';

module('setup', function(hooks) {
  setupStoreTest(hooks);

  test('stores exist', function(assert) {
    assert.ok(this.stores);
  });

  test('store exists', function(assert) {
    assert.ok(this.store);
  });

  test('store is activated', async function(assert) {
    assert.ok(isActivated(this.store));
  });

  test('register model', function(assert) {
    class Box extends EmberObject {
      name = 'box'
    }

    this.registerModel('box', Box);
    let model = this.store.models.create('box', { ok: true });

    assert.ok(model);
    assert.ok(model instanceof Box);
    assert.strictEqual(model.name, 'box');
    assert.strictEqual(model.ok, true);
  });

});

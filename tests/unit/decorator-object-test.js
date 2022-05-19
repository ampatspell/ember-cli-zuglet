import { module, test, setupStoreTest } from '../helpers/setup';
import ZugletObject from 'zuglet/object';
import { object, raw, update } from 'zuglet/decorators/object';

module('decorator / @object', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.model = () => {
      this.registerModel('model', class Model extends ZugletObject {

        @object().onDirty(owner => owner._dataDidChange())
        data

        @raw('data')
        raw

        @update('data')
        update

        _dataDidChange() {}

      });
      return this.store.models.create('model');
    }
  });

  test('direct get and set', async function(assert) {
    let model = this.model();
    model.data = { ok: true };
    assert.deepEqual(model.data, { ok: true });
  });

  test('map to null', async function(assert) {
    let model = this.model();
    model.data = { map: { ok: true } };
    assert.deepEqual(model.data, {
      map: { ok: true }
    });
    model.data.map = null;
    assert.deepEqual(model.data, {
      map: null
    });
  });

  test('map to undefined', async function(assert) {
    let model = this.model();
    model.data = { map: { ok: true } };
    assert.deepEqual(model.data, {
      map: { ok: true }
    });
    model.data.map = undefined;
    assert.deepEqual(model.data, {
    });
  });

  test('update map to null', async function(assert) {
    let model = this.model();
    model.data = { map: { ok: true } };
    assert.deepEqual(model.data, {
      map: { ok: true }
    });
    model.update({ map: null });
    assert.deepEqual(model.data, {
      map: null
    });
  });

  test('update map to undefined', async function(assert) {
    let model = this.model();
    model.data = { map: { ok: true } };
    assert.deepEqual(model.data, {
      map: { ok: true }
    });
    model.update({ map: undefined });
    assert.deepEqual(model.data, {
    });
  });

});

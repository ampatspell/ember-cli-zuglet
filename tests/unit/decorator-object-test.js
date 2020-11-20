import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { object, raw, update } from 'zuglet/decorators/object';

module('decorator / @object', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.model = () => {
      this.registerModel('model', class Model extends EmberObject {

        @object().onDirty(owner => owner._dataDidChange())
        data

        @raw('data')
        raw

        @update('data')
        update

      });
      return this.store.models.create('model');
    }
  });

  test('direct get and set', async function(assert) {
    let model = this.model();
    model.data = { ok: true };
    assert.deepEqual(model.data, { ok: true });
  });



});

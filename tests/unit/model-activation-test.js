import { module, test, setupStoreTest } from '../helpers/setup';
import { activate, isActivated } from 'zuglet/utils';
import { getState } from 'zuglet/-private/model/state';
import EmberObject from '@ember/object';

module('model / activation', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    class Thing extends EmberObject {
    }
    this.registerModel('thing', Thing);
  });

  test('activate', async function(assert) {
    let model = this.store.models.create('thing');
    assert.ok(!isActivated(model));

    let cancel = activate(model);
    assert.ok(isActivated(model));

    let state = getState(model);
    let activators = state.activators.activators;
    assert.strictEqual(activators.length, 1);
    assert.strictEqual(activators[0].object.toString(), '<Activator>');
    assert.strictEqual(activators[0].count, 1);

    cancel();
    assert.ok(!isActivated(model));

    assert.strictEqual(activators.length, 0);
  });

  test('activate multiple times by same activator', async function(assert) {
    let model = this.store.models.create('thing');
    let state = getState(model);
    let activators = state.activators.activators;

    assert.ok(!isActivated(model));

    let one = activate(model);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 1);
    assert.strictEqual(activators[0].count, 1);

    let two = activate(model);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 1);
    assert.strictEqual(activators[0].count, 2);

    one();

    let three = activate(model);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 1);
    assert.strictEqual(activators[0].count, 2);

    two();
    assert.ok(isActivated(model));
    assert.strictEqual(activators[0].count, 1);

    three();
    assert.ok(!isActivated(model));
    assert.strictEqual(activators.length, 0);
  });

  test('activate multiple times by different activators', async function(assert) {
    let a1 = {};
    let a2 = {};
    let a3 = {};

    let model = this.store.models.create('thing');
    let state = getState(model);
    let activators = state.activators.activators;

    assert.ok(!isActivated(model));
    assert.strictEqual(activators.length, 0);

    let one = activate(model, a1);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 1);
    assert.strictEqual(activators[0].count, 1);

    let two = activate(model, a2);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 2);

    one();
    let three = activate(model, a3);
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 2);

    two();
    assert.ok(isActivated(model));
    assert.strictEqual(activators.length, 1);

    three();
    assert.ok(!isActivated(model));
    assert.strictEqual(activators.length, 0);
  });

});

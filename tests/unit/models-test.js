import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';

module('models', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.models = this.store.get('models');
    this.register = (name, factory) => this.owner.register(`model:${name}`, factory);
  });

  test('it exists', async function(assert) {
    assert.ok(this.store.get('models'));
    assert.ok(this.store.get('models._internal'));
  });

  test('model name is normalized', async function(assert) {
    assert.equal(this.models._internal.normalizedModelName('fooBar'), 'foo-bar');
  });

  test('create model', async function(assert) {
    this.register('ducky', EmberObject.extend({
      modelName: 'ducky'
    }));
    let model = this.models.create('ducky', { ok: true });
    assert.ok(model);
    assert.equal(model.get('modelName'), 'ducky');
    assert.equal(model.get('ok'), true);
  });

  test('factory for missing factory', async function(assert) {
    try {
      this.models.factoryFor('foobar');
      assert.ok(false, 'should throw')
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: model 'foobar' is not registered`);
    }
  });

  test('factory for missing factory with optional', async function(assert) {
    let factory = this.models.factoryFor('foobar', { optional: true });
    assert.equal(factory, undefined);
  });

  test('create with missing factory', async function(assert) {
    try {
      this.models.create('foobar');
      assert.ok(false, 'should throw')
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: model 'foobar' is not registered`);
    }
  });

  test('register', async function(assert) {
    this.models.registerFactory('ducky', EmberObject.extend({
      modelName: 'ducky'
    }));
    let model = this.models.create('ducky', { ok: true });
    assert.ok(model);
    assert.equal(model.get('modelName'), 'ducky');
    assert.equal(model.get('ok'), true);
  });

  test('hasFactory', async function(assert) {
    assert.equal(this.models.hasFactoryFor('ducky'), false);
    this.models.registerFactory('ducky', EmberObject.extend());
    assert.equal(this.models.hasFactoryFor('ducky'), true);
  });

});

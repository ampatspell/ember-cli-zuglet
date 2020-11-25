import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { model } from 'zuglet/decorators';
import { isActivated } from 'zuglet/utils';
import { dedupeTracked } from 'tracked-toolbox';

module('decorators / @model', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.registerModel('duck', class Model extends EmberObject {

      type = 'duck'

      mappingDidChange({ id }) {
        this.id = id;
      }

    });

    this.registerModel('hamster', class Model extends EmberObject {
      type = 'hamster'
    });

    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    }
  });

  test('creates named model', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'duck'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let content = box.model;
    assert.ok(content);
    assert.ok(content.type === 'duck');
  });

  test('creates model with static name', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      id = 'yellow'

      @model().named('duck').mapping(({ id }) => ({ id }))
      model

    });

    let content = box.model;
    assert.ok(content);
    assert.ok(content.type === 'duck');
  });

  test('returns null for falsy model name', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'duck'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    this.activate(box);

    box.name = null;
    assert.strictEqual(box.model, null);

    box.name = 'hamster';
    assert.ok(box.model);
    assert.ok(isActivated(box.model));
  });

  test('activate already created model', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'duck'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let content = box.model;
    assert.ok(!isActivated(content));
    let cancel = this.activate(box);
    assert.ok(isActivated(content));
    cancel();
    assert.ok(!isActivated(content));
  });

  test('updates model properties on change', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'duck'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let first = box.model;
    assert.ok(first.type === 'duck');
    assert.ok(first.id === 'yellow');

    box.id = 'green';
    assert.ok(box.model === first);
    assert.ok(first.id === 'green');
  });

  test('dedupes named changes', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'hamster'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let first = box.model;
    box.name = 'hamster';
    assert.ok(first === box.model);
  });

  test('dedupes mapping changes', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'hamster'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let first = box.model;
    box.id = 'yellow';
    assert.ok(first === box.model);
  });

  test('replces model on properties change if mappingDidChange doesnt exist', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'hamster'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let cancel = this.activate(box);

    let first = box.model;
    assert.ok(first.type === 'hamster');
    assert.ok(first.id === 'yellow');

    assert.ok(isActivated(first));

    box.id = 'green';

    assert.ok(box.model !== first);
    assert.ok(box.model.id === 'green');

    assert.ok(!isActivated(first));
    assert.ok(isActivated(box.model));

    cancel();

    assert.ok(!isActivated(box.model));
  });

  test('replaces model on name change', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      name = 'duck'

      @dedupeTracked
      id = 'yellow'

      @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
      model

    });

    let cancel = this.activate(box);

    let first = box.model;
    assert.ok(isActivated(first));
    assert.ok(first.type === 'duck');

    box.name = 'hamster';
    assert.ok(box.model !== first);
    assert.ok(box.model.type === 'hamster');

    assert.ok(!isActivated(first));
    assert.ok(isActivated(box.model));

    cancel();

    assert.ok(!isActivated(box.model));
  });

});

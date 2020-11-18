import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { activate as _activate, isActivated } from 'zuglet/utils';

module('decorators / @activate / writable / object', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.registerModel('model', class Model extends EmberObject {
    });
    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    }
  });

  test('model is activated when parent is', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      model

    });

    let yellow = this.store.models.create('model');

    box.model = yellow;
    assert.ok(!isActivated(yellow));

    this.activate(box);
    assert.ok(isActivated(yellow));
  });

  test('model is deactivated when parent is', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      model

    });

    let cancel = _activate(box);

    let yellow = this.store.models.create('model');

    box.model = yellow;
    assert.ok(isActivated(yellow));

    cancel();

    assert.ok(!isActivated(yellow));
  });

  test('model is activated on set', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      model

    });

    this.activate(box);

    let yellow = this.store.models.create('model');

    box.model = yellow;
    assert.ok(isActivated(yellow));
  });

  test('model is deactivated on unset', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      model

    });

    this.activate(box);

    let yellow = this.store.models.create('model');

    box.model = yellow;
    assert.ok(isActivated(yellow));
    box.model = null;
    assert.ok(!isActivated(yellow));
    assert.ok(!box.model);
  });

  test('models are deactivated - activated on replace', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      model

    });

    this.activate(box);

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.model = yellow;
    assert.ok(isActivated(yellow));
    box.model = green;
    assert.ok(!isActivated(yellow));
    assert.ok(isActivated(green));
    assert.ok(box.model === green);
  });

});

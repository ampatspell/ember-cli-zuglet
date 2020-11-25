import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { activate as _activate, isActivated } from 'zuglet/utils';

module('decorators / @activate / writable / array', function(hooks) {
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

  test('array is activated when parent is', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      models

    });

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.models = [ yellow, green ];
    assert.ok(!isActivated(yellow));
    assert.ok(!isActivated(green));

    this.activate(box);

    assert.ok(isActivated(yellow));
    assert.ok(isActivated(green));
  });

  test('array is deactivated when parent is', function(assert) {
    let box = this.define(class Box extends EmberObject {

      @activate()
      models

    });

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.models = [ yellow, green ];
    assert.ok(!isActivated(yellow));
    assert.ok(!isActivated(green));

    let cancel = _activate(box);

    assert.ok(isActivated(yellow));
    assert.ok(isActivated(green));

    cancel();

    assert.ok(!isActivated(yellow));
    assert.ok(!isActivated(green));
  });

  test('array is activated on set', function(assert)  {
    let box = this.define(class Box extends EmberObject {

      @activate()
      models

    });

    this.activate(box);

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.models = [ yellow, green ];
    assert.ok(isActivated(yellow));
    assert.ok(isActivated(green));
  });

  test('array is deactivated-activated on replace', function(assert)  {
    let box = this.define(class Box extends EmberObject {

      @activate()
      models

    });

    this.activate(box);

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.models = [ yellow ];
    assert.ok(isActivated(yellow));
    assert.ok(!isActivated(green));

    box.models = [ green ];
    assert.ok(!isActivated(yellow));
    assert.ok(isActivated(green));
  });

  test('items are activated-deactivated on mutations', function(assert)  {
    let box = this.define(class Box extends EmberObject {

      @activate()
      models

    });

    this.activate(box);

    let yellow = this.store.models.create('model');
    let green = this.store.models.create('model');

    box.models = [];

    box.models.push(yellow);
    assert.ok(isActivated(yellow));
    box.models.push(green);
    assert.ok(isActivated(green));

    box.models.pop();
    assert.ok(isActivated(yellow));
    assert.ok(!isActivated(green));

    box.models.pop();
    assert.ok(!isActivated(yellow));
    assert.ok(!isActivated(green));

    box.models[0] = yellow;
    assert.ok(isActivated(yellow));
    assert.ok(!isActivated(green));

    box.models[0] = green;
    assert.ok(!isActivated(yellow));
    assert.ok(isActivated(green));
  });

});

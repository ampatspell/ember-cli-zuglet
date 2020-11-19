import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';
import { isActivated } from 'zuglet/utils';

module('decorators / @activate / content / array', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.registerModel('model', class Model extends EmberObject {});
    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    }
  });

  test('content is recreated on dependency change', async function(assert) {
    let create = [];

    let box = this.define(class Box extends EmberObject {

      @tracked
      names = [ 'one', 'two' ]

      @activate().content(({ store, names }) => names.map(name => {
        create.push(name);
        return store.models.create('model', { name });
      }))
      models

    });

    let cancel = this.activate(box);

    assert.deepEqual(box.models.map(m => m.name), [ 'one', 'two' ]);

    assert.ok(isActivated(box.models[0]));
    assert.ok(isActivated(box.models[1]));
    let first = [ ...box.models ];

    box.names = [ 'one', 'two' ];
    assert.deepEqual(box.models.map(m => m.name), [ 'one', 'two' ]);
    assert.ok(isActivated(box.models[0]));
    assert.ok(isActivated(box.models[1]));

    let second = [ ...box.models ];

    assert.ok(!isActivated(first[0]));
    assert.ok(!isActivated(first[1]));

    cancel();

    assert.ok(!isActivated(second[0]));
    assert.ok(!isActivated(second[1]));

    assert.deepEqual(create, [ 'one', 'two', 'one', 'two' ]);
  });

});

import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

module('decorators / @activate / content', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    class Nested extends EmberObject {
    }

    class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @tracked
      mapped = 'duck'

      @activate()
        .mapping(({ mapped }) => ({ mapped }))
        .content(({ store, base }, { mapped }) => store.models.create('nested', { base, mapped }))
      model
    }

    this.registerModel('nested', Nested);
    this.registerModel('box', Box);
  });

  // @activate without mapping
  //   recreate on content props change
  // @activate with mapping
  //   recreate on mapping chnage
  //   doesn't recreate on content props change

  test('mapping vs content', async function(assert) {
    let box = this.store.models.create('box', { store: this.store });

    let model = box.model;
    assert.ok(model);
    assert.strictEqual(model.base, 'zeeba');
    assert.strictEqual(model.mapped, 'duck');

    assert.ok(box.model === model);

    box.base = 'larry';

    assert.ok(box.model === model);

    box.mapped = 'foof';

    let nextModel = box.model;
    assert.ok(nextModel !== model);
  });

});
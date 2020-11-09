import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

module('decorators / @activate / content', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.registerModel('nested', class Nested extends EmberObject {
    });
    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    }
  });

  test('with mapping ignores content prop changes', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @tracked
      mapped = 'duck'

      @activate()
        .mapping(({ mapped }) => ({ mapped }))
        .content(({ mapped }, { store, base }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    box.base = 'change';
    assert.ok(box.model === model);
  });

  test('with mapping recreates on mapped prop change', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @tracked
      mapped = 'duck'

      @activate()
        .mapping(({ mapped }) => ({ mapped }))
        .content(({ mapped }, { store, base }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    box.mapped = 'change';
    assert.ok(box.model !== model);
  });

  test('with mapping ignores mapped prop ping', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @tracked
      mapped = 'duck'

      @activate()
        .mapping(({ mapped }) => ({ mapped }))
        .content(({ mapped }, { store, base }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    box.mapped = 'duck';
    assert.ok(box.model === model);
  });

  test('without mapping recreates on content props change', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @activate()
        .content(({ store, base }) => store.models.create('nested', { base }))
      model

    });

    let model = box.model;
    box.base = 'larry';
    assert.ok(box.model !== model);
  });

  test(`without mapping model is recreated on prop ping`, async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @activate()
        .content(({ store, base }) => store.models.create('nested', { base }))
      model

    });

    let model = box.model;
    box.base = 'zeeba';
    assert.ok(box.model !== model);
  });

  test('mapping can be described as array of prop names', async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @tracked
      mapped = 'duck'

      @activate()
        .mapping('store', 'base', 'mapped')
        .content(({ store, base, mapped }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    assert.strictEqual(model.base, 'zeeba');
    assert.strictEqual(model.mapped, 'duck');
  });


});
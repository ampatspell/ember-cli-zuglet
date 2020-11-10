import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';
import { dedupeTracked } from 'tracked-toolbox';

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

  test(`model is recreated if @dedupeTracked is set to the same value`, async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @dedupeTracked
      mapped = 'duck'

      @activate()
        .content(({ store, base, mapped }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    box.mapped = 'change';
    assert.ok(box.model !== model);
  });

  test(`model is not recreated if @dedupeTracked is set to the same value`, async function(assert) {
    let box = this.define(class Box extends EmberObject {

      @tracked
      base = 'zeeba'

      @dedupeTracked
      mapped = 'duck'

      @activate()
        .content(({ store, base, mapped }) => store.models.create('nested', { base, mapped }))
      model

    });

    let model = box.model;
    box.mapped = 'duck';
    assert.ok(box.model === model);
  });

  test(`model is recreated if @tracked property is set to another value`, async function(assert) {
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

  test(`model is recreated if @tracked property is set to the same value`, async function(assert) {
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

});
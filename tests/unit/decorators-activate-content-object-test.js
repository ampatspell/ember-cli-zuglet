import { module, test, setupStoreTest } from '../helpers/setup';
import ZugletObject, { setProperties } from 'zuglet/object';
import { activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';
import { isActivated } from 'zuglet/utils';
import { dedupeTracked } from 'tracked-toolbox';

module('decorators / @activate / content / object', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.registerModel('nested', class Nested extends ZugletObject {
      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }
    });
    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    };
  });

  test('initial content is activated and deactivated on recreate', async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @activate().content(({ store, base }) => store.models.create('nested', { base }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    this.activate(box);

    let first = box.model;
    assert.ok(isActivated(first));

    box.base = 'larry';

    let second = box.model;
    assert.ok(second !== first);
    assert.ok(isActivated(second));
    assert.ok(!isActivated(first));
  });

  test('content is replaced and then activated', async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @activate().content(({ store, base }) => store.models.create('nested', { base }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let first = box.model;
    assert.ok(!isActivated(first));

    box.base = 'larry';
    this.activate(box);

    let second = box.model;
    assert.ok(second !== first);
    assert.ok(isActivated(second));
    assert.ok(!isActivated(first));
  });

  test('content is activated when parent is and deactivated when parent is', async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @activate().content(({ store, base }) => store.models.create('nested', { base }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let first = box.model;
    assert.ok(!isActivated(first));

    let cancel = this.activate(box);

    let second = box.model;
    assert.ok(second === first);
    assert.ok(isActivated(first));

    cancel();

    let third = box.model;
    assert.ok(first === third);
    assert.ok(!isActivated(first));
  });

  test(`model is recreated if @dedupeTracked is set to the same value`, async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @dedupeTracked
      deduped = 'duck'

      @activate().content(({ store, base, deduped }) => store.models.create('nested', { base, deduped }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let model = box.model;
    box.deduped = 'change';
    assert.ok(box.model !== model);
  });

  test(`model is not recreated if @dedupeTracked is set to the same value`, async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @dedupeTracked
      deduped = 'duck'

      @activate().content(({ store, base, deduped }) => store.models.create('nested', { base, deduped }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let model = box.model;
    box.deduped = 'duck';
    assert.ok(box.model === model);
  });

  test(`model is recreated if @tracked property is set to another value`, async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @activate().content(({ store, base }) => store.models.create('nested', { base }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let model = box.model;
    box.base = 'larry';
    assert.ok(box.model !== model);
  });

  test(`model is recreated if @tracked property is set to the same value`, async function(assert) {
    let box = this.define(class Box extends ZugletObject {

      @tracked
      base = 'zeeba'

      @activate()
        .content(({ store, base }) => store.models.create('nested', { base }))
      model

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    let model = box.model;
    box.base = 'zeeba';
    assert.ok(box.model !== model);
  });

});

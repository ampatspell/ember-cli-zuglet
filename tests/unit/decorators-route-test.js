import { module, test, setupStoreTest } from '../helpers/setup';
import ZugletObject, { setProperties } from 'zuglet/object';
import { route as routeDecorator } from 'zuglet/decorators';
import { isActivated } from 'zuglet/utils';

module('decorators / @route', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {

    class BaseRoute extends ZugletObject {

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

      resetController() {
      }

    }

    @routeDecorator()
    class Route extends BaseRoute {

      async model(arg) {
        assert.ok(isActivated(this));
        assert.ok(!isActivated(arg));
        this.onModel && this.onModel();
        return arg;
      }

      async load(model) {
        assert.ok(isActivated(this));
        assert.ok(isActivated(model));
        await model.load();
      }

    }

    class Model extends ZugletObject {

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

      async load() {
        assert.ok(isActivated(this));
        this.onLoad && this.onLoad();
        this.loaded = true;
      }

    }

    this.registerModel('route', Route);
    this.registerModel('model', Model);
  });

  test('activate, load and deactivate', async function(assert) {
    let route = this.store.models.create('route');
    let model = this.store.models.create('model');

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));

    route.transition = { isAborted: false };

    await route.model(model, route.transition);

    assert.ok(model.loaded);
    assert.ok(isActivated(route));
    assert.ok(isActivated(model));

    route.resetController(null, true);

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));
  });

  test('aborted model deactivates', async function(assert) {
    let route = this.store.models.create('route');
    let model = this.store.models.create('model');

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));

    let transition = { isAborted: false };

    route.onModel = () => {
      transition.isAborted = true;
    };

    await route.model(model, transition);

    assert.ok(!model.loaded);
    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));
  });

  test('thrown model deactivates', async function(assert) {
    let route = this.store.models.create('route');
    let model = this.store.models.create('model');

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));

    let transition = { isAborted: false };

    route.onModel = () => {
      throw new Error('done');
    };

    try {
      await route.model(model, transition);
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, 'done');
    }

    assert.ok(!model.loaded);
    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));
  });

  test('aborted load deactivates', async function(assert) {
    let route = this.store.models.create('route');
    let model = this.store.models.create('model');

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));

    let transition = { isAborted: false };

    model.onLoad = () => {
      transition.isAborted = true;
    };

    await route.model(model, transition);

    assert.ok(model.loaded);
    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));
  });

  test('thrown load deactivates', async function(assert) {
    let route = this.store.models.create('route');
    let model = this.store.models.create('model');

    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));

    let transition = { isAborted: false };

    model.onLoad = () => {
      throw new Error('done');
    };

    try {
      await route.model(model, transition);
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, 'done');
    }

    assert.ok(!model.loaded);
    assert.ok(!isActivated(route));
    assert.ok(!isActivated(model));
  });

});

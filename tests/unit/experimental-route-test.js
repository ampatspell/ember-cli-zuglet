import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import model from 'ember-cli-zuglet/experimental/model/route';
import { resolve } from 'rsvp';
import { run } from '@ember/runloop';

const Route = EmberObject.extend({

  init() {
    this._super(...arguments);
    this.models = {};
  },

  _model(params) {
    return resolve(this.model(params)).then(model => this.currentModel = model);
  },

  _modelFor(key, value) {
    this.models[key] = value;
  },

  modelFor(key) {
    return this.models[key];
  },

  resetController() {
  }

});

module('experimental-route', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.create = (name, props) => {
      let factory = Route.extend(props);
      let owner = this.getOwner();
      let fullName = `route:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create({ routeName: name });
    };
  });

  test('inline model without mapping', async function(assert) {
    let route = this.create('test', {
      model: model({
        prepare(...args) {
          this.args = args;
        }
      })
    });

    let params = { ok: true };
    let result = await route._model(params);

    assert.ok(result);
    assert.ok(result.args[0] === route);
    assert.ok(result.args[1] === params);

    run(() => route.resetController());

    assert.equal(result.isDestroyed, true);
  });

  test('inline model with mapping', async function(assert) {
    let route = this.create('test', {
      model: model({
        prepare(arg) {
          this.arg = arg;
        }
      }).mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });

    let params = { source_id: 'one' };
    let sources = {};

    route._modelFor('sources', sources);

    let result = await route._model(params);

    assert.ok(result);
    assert.ok(result.arg);
    assert.ok(result.arg.id === 'one');
    assert.ok(result.arg.sources === sources);
  });

  test('provided default model', async function(assert) {
    let Model = EmberObject.extend({
      prepare(arg) {
        this.arg = arg;
      }
    });

    this.getOwner().register('model:route/test', Model);

    let route = this.create('test', {
      model: model().mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });

    let params = { source_id: 'one' };
    let sources = {};

    route._modelFor('sources', sources);

    let result = await route._model(params);

    assert.ok(result);
    assert.ok(Model.detectInstance(result));
    assert.ok(result.arg);
    assert.ok(result.arg.id === 'one');
    assert.ok(result.arg.sources === sources);
  });

  test('provided default model requires mapping', async function(assert) {
    let Model = EmberObject.extend();
    this.getOwner().register('model:route/test', Model);

    let route = this.create('test', {
      model: model()
    });

    try {
      await route._model();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.message, 'Assertion Failed: route models which are not created inline requires mapping');
    }
  });

  test('provided model with model name', async function(assert) {
    let Model = EmberObject.extend({
      prepare(arg) {
        this.arg = arg;
      }
    });

    this.getOwner().register('model:route/foobar', Model);

    let route = this.create('test', {
      model: model('route/foobar').mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });

    let params = { source_id: 'one' };
    let sources = {};

    route._modelFor('sources', sources);

    let result = await route._model(params);

    assert.ok(result);
    assert.ok(Model.detectInstance(result));
    assert.ok(result.arg);
    assert.ok(result.arg.id === 'one');
    assert.ok(result.arg.sources === sources);
  });

  test('provided model with model name requires mapping', async function(assert) {
    let Model = EmberObject.extend();
    this.getOwner().register('model:route/foobar', Model);

    let route = this.create('test', {
      model: model('route/foobar')
    });

    try {
      await route._model();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.message, 'Assertion Failed: route models which are not created inline requires mapping');
    }
  });

});

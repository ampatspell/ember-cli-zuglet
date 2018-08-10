import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { route } from 'ember-cli-zuglet/less-experimental';
import { run } from '@ember/runloop';
import { resolve } from 'rsvp';

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

module('less-experimental-route', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.object = props => EmberObject.create(props);
    this.registerModel = (name, factory) => this.getOwner().register(`model:${name}`, factory);
    this.route = (props, name='test') => {
      let factory = Route.extend(props);
      let owner = this.getOwner();
      let fullName = `route:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create({ routeName: name });
    };
  });

  test('create and destroy', async function(assert) {
    let subject = this.route({
      model: route().inline({
        prepare(route, params) {
          assert.ok(route === subject);
          assert.equal(params.id, 'yellow');
          this.setProperties({ ok: true });
        }
      })
    });

    let promise = subject._model({ id: 'yellow' });

    assert.ok(promise);
    assert.ok(promise.then);

    let instance = await promise;

    assert.equal(instance.get('ok'), true);

    assert.ok(instance.__zuglet_route_internal);
    assert.ok(instance._internal);

    run(() => subject.resetController());

    assert.ok(instance._internal.isDestroying);
    assert.ok(instance.isDestroying);
  });

});

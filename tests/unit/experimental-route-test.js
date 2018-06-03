import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import model from 'ember-cli-zuglet/experimental/model/route';
import { resolve } from 'rsvp';

const Route = EmberObject.extend({

  _model(params) {
    return resolve(this.model(params)).then(model => this.currentModel = model);
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

    assert.equal(result.isDestroyed);
  });

  test.skip('inline model with mapping', function(assert) {
    let route = this.create('test', {
      model: model({
        prepare({ sources, id }) {
        }
      }).mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });
  });

  test.skip('provided default model', function(assert) {
    let route = this.create('test', {
      model: model().mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });
  });

  test.skip('provided default model requires mapping', function(assert) {
    let route = this.create('test', {
      model: model()
    });
  });

  test.skip('provided model with model name', function(assert) {
    let route = this.create('test', {
      model: model('source').mapping((route, params) => ({
        sources: route.modelFor('sources'),
        id: params.source_id
      }))
    });
  });

  test.skip('provided model with model name requires mapping', function(assert) {
    let route = this.create('test', {
      model: model('source')
    });
  });

});

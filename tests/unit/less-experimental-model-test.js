import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { model } from 'ember-cli-zuglet/less-experimental';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('less-experimental-model', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.object = props => EmberObject.create(props);
    this.registerModel = (name, factory) => this.getOwner().register(`model:${name}`, factory);
    this.subject = (props, name='subject') => {
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('model is created', async function(assert) {
    let subject = this.subject({
      name: 'duck',
      model: model().inline({
        prepare(owner) {
          this.setProperties(owner.getProperties('name'));
        }
      })
    });

    let first = subject.get('model');
    assert.ok(first);

    assert.equal(first.get('name'), 'duck');

    run(() => subject.destroy());

    assert.ok(first.isDestroying);
  });

  test('model is recreated on owner dep change', async function(assert) {
    let subject = this.subject({
      name: 'duck',
      model: model().owner('name').inline({
        prepare(owner) {
          this.setProperties(owner.getProperties('name'));
        }
      })
    });

    let first = subject.get('model');
    assert.equal(first.get('name'), 'duck');

    run(() => subject.set('name', 'hamster'));

    assert.ok(first.isDestroying);

    let second = run(() => subject.get('model'));

    assert.ok(second !== first);
    assert.equal(second.get('name'), 'hamster');

    run(() => subject.destroy());

    assert.ok(second.isDestroying);
  });

  test('statically named model', async function(assert) {
    this.registerModel('duck', EmberObject.extend({
      modelName: 'duck',
      prepare({ message }) {
        this.setProperties({ message });
      }
    }));

    let subject = this.subject({
      message: 'hello',
      model: model().named('duck').mapping(owner => {
        let message = owner.get('message');
        return { message };
      })
    });

    let first = subject.get('model');
    assert.equal(first.get('modelName'), 'duck');
    assert.equal(first.get('message'), 'hello');

    run(() => subject.destroy());
  });

  test('model name lookup', async function(assert) {
    let Model = EmberObject.extend({
      prepare(owner) {
        this.setProperties(owner.getProperties('message'));
      }
    });
    this.registerModel('duck', Model.extend({
      modelName: 'duck',
    }));
    this.registerModel('hamster', Model.extend({
      modelName: 'hamster',
    }));

    let subject = this.subject({
      message: 'hello',
      type: 'duck',
      model: model().owner('type').named(owner => owner.get('type'))
    });

    let first = subject.get('model');
    assert.equal(first.get('modelName'), 'duck');
    assert.equal(first.get('message'), 'hello');

    run(() => subject.set('type', 'hamster'));

    assert.ok(first.isDestroying);

    let second = run(() => subject.get('model'));
    assert.ok(second !== first);
    assert.equal(second.get('modelName'), 'hamster');

    run(() => subject.destroy());

    assert.ok(second.isDestroying);
  });

  test('model name lookup yields null', async function(assert) {
    let Model = EmberObject.extend({
      prepare(owner) {
        this.setProperties(owner.getProperties('message'));
      }
    });
    this.registerModel('duck', Model.extend({
      modelName: 'duck',
    }));

    let subject = this.subject({
      message: 'hello',
      model: model().owner('type').named(owner => owner.get('type'))
    });

    let first = subject.get('model');
    assert.ok(first === null);

    run(() => subject.set('type', 'duck'));

    let second = run(() => subject.get('model'));
    assert.equal(second.get('modelName'), 'duck');

    run(() => subject.set('type', undefined));

    assert.ok(second.isDestroying);

    let third = run(() => subject.get('model'));
    assert.ok(third === null);

    run(() => subject.set('type', 'duck'));

    let fourth = run(() => subject.get('model'));
    assert.equal(fourth.get('modelName'), 'duck');

    run(() => subject.destroy());

    assert.ok(fourth.isDestroying);
  });

  test('mapping returns null', async function(assert) {
    let subject = this.subject({
      model: model().owner('type').inline({
        prepare({ type }) {
          this.setProperties({ type });
        }
      }).mapping(owner => {
        let type = owner.get('type');
        if(!type) {
          return;
        }
        return { type };
      })
    });

    let first = subject.get('model');
    assert.ok(first === null);

    run(() => subject.set('type', 'duck'));

    let second = run(() => subject.get('model'));
    assert.equal(second.get('type'), 'duck');

    run(() => subject.set('type', undefined));

    assert.ok(second.isDestroying);

    let third = run(() => subject.get('model'));
    assert.ok(third === null);

    run(() => subject.set('type', 'hamster'));

    let fourth = run(() => subject.get('model'));
    assert.equal(fourth.get('type'), 'hamster');

    run(() => subject.destroy());

    assert.ok(fourth.isDestroying);
  });

  test('default prepare for mapping', async function(assert) {
    let subject = this.subject({
      message: 'hello',
      model: model().inline({
      }).mapping(owner => {
        let message = owner.get('message');
        return { message };
      })
    });
    assert.equal(subject.get('model.message', 'hello'));
  });

  test('prepare is required if no mapping', async function(assert) {
    let subject = this.subject({
      message: 'hello',
      model: model().inline({})
    });
    try {
      subject.get('model');
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: models require 'prepare' prepare function if mapping is not provided`);
    }
  });

});

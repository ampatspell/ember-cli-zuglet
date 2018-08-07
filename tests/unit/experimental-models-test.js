import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import models from 'ember-cli-zuglet/experimental/models';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('experimental-models', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.registerModel = (name, factory) => this.getOwner().register(`model:${name}`, factory);
    this.create = (name, props) => {
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('create and destroy', async function(assert) {
    this.registerModel('post', EmberObject.extend({
      id: null
    }));

    let subject = this.create('subject', {
      content: null,
      models: models('content', 'post').mapping(id => ({ id }))
    });

    assert.equal(subject.get('models'), undefined);

    subject.set('content', [ 'yellow', 'green' ]);

    let instance = run(() => subject.get('models.length'));

    assert.equal(instance, 2);
    assert.deepEqual(instance.mapBy('id'), [ 'yellow', 'green' ]);

    let yellow = instance.objectAt(0);
    let green = instance.objectAt(1);

    subject.set('content', []);
    assert.deepEqual(subject.get('models').mapBy('id'), []);

    assert.ok(instance.isDestroyed);
    assert.ok(yellow.isDestroyed);
    assert.ok(green.isDestroyed);
  });

});

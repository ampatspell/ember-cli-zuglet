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
      id: null,
      prepare({ id }) {
        this.setProperties({ id });
      }
    }));

    let subject = this.create('subject', {
      content: null,
      models: models('content', 'post').mapping(id => ({ id }))
    });

    assert.equal(subject.get('models.length'), 0); // should be undefined

    run(() => subject.set('content', [ 'yellow', 'green' ]));

    let fist = run(() => subject.get('models'));

    assert.equal(fist.get('length'), 2);
    assert.deepEqual(fist.mapBy('id'), [ 'yellow', 'green' ]);

    let yellow = fist.objectAt(0);
    let green = fist.objectAt(1);

    subject.set('content', []);

    let second = run(() => subject.get('models'));

    assert.deepEqual(run(() => second.mapBy('id')), []);

    assert.ok(yellow.isDestroyed);
    assert.ok(green.isDestroyed);
  });

});

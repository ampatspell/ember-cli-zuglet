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
    this.subject = props => {
      let name = 'subject';
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('models content is null if there is no source', async function(assert) {
    let subject = this.subject({
      models: models('source', {})
    });
    let prop = subject.get('models');
    assert.ok(prop);
    assert.equal(prop.get('content'), null);
  });

  test('models content is empty if there is no source objects', async function(assert) {
    let subject = this.subject({
      source: [],
      models: models('source', {})
    });
    let prop = subject.get('models');
    assert.ok(prop);
    assert.deepEqual(prop.get('content'), []);
  });

  // inline with mapping
  // resolved without mapping
  // resolved with mapping
  // named without mapping
  // named with mapping

  test.skip('create and destroy', async function(assert) {
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

    assert.equal(subject.get('models.content.length'), 0); // should be undefined

    run(() => subject.set('content', [ 'yellow', 'green' ]));

    let fist = run(() => subject.get('models'));

    assert.equal(fist.get('content.length'), 2);
    assert.deepEqual(fist.mapBy('id'), [ 'yellow', 'green' ]);

    let yellow = fist.objectAt(0);
    let green = fist.objectAt(1);

    run(() => subject.set('content', []));

    let second = run(() => subject.get('models.content'));

    assert.deepEqual(run(() => second.mapBy('id')), []);

    assert.ok(yellow.isDestroyed);
    assert.ok(green.isDestroyed);
  });

});

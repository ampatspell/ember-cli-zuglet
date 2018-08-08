import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import models from 'ember-cli-zuglet/experimental/models';
import { run } from '@ember/runloop';
import { A } from '@ember/array';

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
      source: A(),
      models: models('source', {})
    });
    let prop = subject.get('models');
    assert.ok(prop);
    assert.deepEqual(prop.get('content'), []);
  });

  test('models content stays the same array', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare() {}
      })
    });

    let prop = subject.get('models');
    let content = prop.get('content');

    assert.deepEqual(content, []);

    subject.get('source').pushObject({ ok: true });

    assert.ok(content === prop.get('content'));
    assert.equal(content.get('length'), 1);
  });

  test('removed models are destroyed', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare(raw) {
          this.setProperties({ raw });
        }
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject({ id: 'first' });

    assert.equal(prop.get('content.length'), 1);

    let first = prop.get('content.firstObject');

    assert.equal(first.get('raw.id'), 'first');
    assert.ok(!first.isDestroying);

    source.removeAt(0);

    assert.equal(run(() => prop.get('content.length')), 0);
    assert.ok(first.isDestroying);
  });

  test('models are destroyed on prop destroy', async function(assert) {
    let subject = this.subject({
      source: A([ { id: 'first' } ]),
      models: models('source', {
        prepare(raw) {
          this.setProperties({ raw });
        }
      })
    });

    let prop = subject.get('models');

    assert.equal(prop.get('content.length'), 1);
    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.ok(!first.isDestroying);

    run(() => subject.destroy());

    assert.ok(first.isDestroying);
  });

  // inline without mapping
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

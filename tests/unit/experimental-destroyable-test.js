import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import model from 'ember-cli-zuglet/experimental/model';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('experimental-destroyable', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.create = (name, props) => {
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('inline without mapping, non reusable', async function(assert) {
    let subject = this.create('subject', {

      id: null,

      model: model('id', {
        prepare(owner) {
          this.id = owner.get('id');
        }
      })

    });

    let first = subject.get('model');
    assert.ok(first);
    assert.equal(first.get('id'), null);

    subject.set('id', 'foo');

    let next = run(() => subject.get('model'));

    assert.ok(next);
    assert.equal(next.get('id'), 'foo');

    assert.ok(next !== first);
    assert.ok(first.isDestroyed);
    assert.ok(!next.isDestroyed);
  });

  test('inline with mapping, non reusable', async function(assert) {
    let subject = this.create('subject', {

      id: null,

      model: model('id', {
        prepare({ value }) {
          this.value = value;
        }
      }).mapping(owner => ({ value: owner.get('id') }))

    });

    let first = subject.get('model');
    assert.ok(first);
    assert.equal(first.get('value'), null);

    subject.set('id', 'foo');

    let next = run(() => subject.get('model'));

    assert.ok(next);
    assert.equal(next.get('value'), 'foo');

    assert.ok(next !== first);
    assert.ok(first.isDestroyed);
    assert.ok(!next.isDestroyed);
  });

  test('inline with mapping, reusable', async function(assert) {
    let subject = this.create('subject', {

      id: null,

      model: model('id', {
        prepare({ value }) {
          this.value = value;
        }
      }).mapping(owner => ({ value: owner.get('id') })).reusable()

    });

    let first = subject.get('model');
    assert.ok(first);
    assert.equal(first.get('value'), null);

    subject.set('id', 'foo');

    let next = subject.get('model');

    assert.ok(next);
    assert.ok(next === first);

    assert.equal(first.get('value'), 'foo');

    assert.ok(!first.isDestroyed);
  });

  test('model throws on missing model class', async function(assert) {
    let subject = this.create('subject', {
      model: model('id', 'thing')
    });

    try {
      subject.get('model');
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: model 'thing' is not registered`);
    }
  });

  test('model throws on missing model class', async function(assert) {
    let Thing = EmberObject.extend();
    this.getOwner().register('model:thing', Thing);

    let subject = this.create('subject', {
      model: model('id', 'thing')
    });

    try {
      subject.get('model');
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: model requires mapping`);
    }
  });

  test('model with mapping, non-reusable', async function(assert) {
    let Thing = EmberObject.extend({

      prepare({ value }) {
        this.value = value;
      }

    });
    this.getOwner().register('model:thing', Thing);

    let subject = this.create('subject', {
      model: model('id', 'thing').mapping(owner => ({ value: owner.get('id') }))
    });

    let first = subject.get('model');
    assert.ok(first);
    assert.equal(first.get('value'), null);

    subject.set('id', 'foo');

    let next = run(() => subject.get('model'));

    assert.ok(next);
    assert.equal(next.get('value'), 'foo');

    assert.ok(next !== first);
    assert.ok(first.isDestroyed);
    assert.ok(!next.isDestroyed);
  });

  test('model with mapping, reusable', async function(assert) {
    let Thing = EmberObject.extend({

      prepare({ value }) {
        this.value = value;
      }

    });
    this.getOwner().register('model:thing', Thing);

    let subject = this.create('subject', {
      model: model('id', 'thing').mapping(owner => ({ value: owner.get('id') })).reusable()
    });

    let first = subject.get('model');
    assert.ok(first);
    assert.equal(first.get('value'), null);

    subject.set('id', 'foo');

    let next = subject.get('model');

    assert.ok(next);
    assert.ok(next === first);

    assert.equal(first.get('value'), 'foo');

    assert.ok(!first.isDestroyed);
  });

});

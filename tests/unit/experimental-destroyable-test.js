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

  test('model with resolved model name is null if model name is not set', async function(assert) {
    let subject = this.create('subject', {
      model: model('id', () => undefined).mapping(owner => ({ value: owner.get('id') }))
    });
    let first = subject.get('model');
    assert.ok(!first);
  });

  test('model with resolved model name is created and replaced', async function(assert) {
    let Thing = EmberObject.extend({
      prepare({ value }) {
        this.value = value;
      }
    });

    let One = Thing.extend({ name: 'one' });
    this.getOwner().register('model:one', One);

    let Two = Thing.extend({ name: 'two' });
    this.getOwner().register('model:two', Two);

    let subject = this.create('subject', {
      id: 'one',
      model: model('id', owner => owner.get('id')).mapping(owner => ({ value: owner.get('id') }))
    });

    let first = subject.get('model');
    assert.equal(first.get('name'), 'one');

    subject.set('id', 'two');

    let second = run(() => subject.get('model'));
    assert.equal(second.get('name'), 'two');
    assert.ok(first !== second);
    assert.ok(first.isDestroyed);

    subject.set('id', 'two');

    let third = run(() => subject.get('model'));
    assert.equal(third.get('name'), 'two');
    assert.ok(second === third);
    assert.ok(!second.isDestroyed);

    subject.set('id', null);

    let fourth = run(() => subject.get('model'));
    assert.equal(fourth, undefined);
    assert.ok(third.isDestroyed);

    subject.set('id', 'one');

    let fifth = run(() => subject.get('model'));
    assert.equal(fifth.get('name'), 'one');
    assert.ok(!fifth.isDestroyed);
  });

});

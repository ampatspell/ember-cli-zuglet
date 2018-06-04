import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import model from 'ember-cli-zuglet/experimental/model';
import { resolve } from 'rsvp';
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

});

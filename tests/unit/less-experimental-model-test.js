import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { model } from 'ember-cli-zuglet/less-experimental';
import { A } from '@ember/array';
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

});

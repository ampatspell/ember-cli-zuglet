import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { models } from 'ember-cli-zuglet/less-experimental';
import { A } from '@ember/array';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('less-experimental-models', function(hooks) {
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

  test('source change', async function(assert) {
    let duck = this.object({ name: 'duck' });
    let hamster = this.object({ name: 'hamster' });
    let otter = this.object({ name: 'otter' });

    let subject = this.subject({

      all: A([ duck, hamster, otter ]),
      selected: A([ duck, otter ]),
      type: 'all',

      models: models('type', owner => owner.type).object('name').inline({
        prepare(object) {
          this.setProperties({ name: object.name });
        }
      })

    });

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck', 'hamster', 'otter' ]);

    let all = subject.get('models').slice();
    assert.deepEqual(all.map(m => m.isDestroying), [ false, false, false ]);

    run(() => subject.set('type', 'selected'));

    assert.deepEqual(all.map(m => m.isDestroying), [ true, true, true ]);

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck', 'otter' ]);

    let selected = subject.get('models').slice();

    run(() => subject.destroy());

    assert.deepEqual(selected.map(m => m.isDestroying), [ true, true ]);
  });

  test('source content mutations', async function(assert) {
    let duck = this.object({ name: 'duck' });
    let otter = this.object({ name: 'otter' });

    let subject = this.subject({

      all: A([ otter ]),

      models: models('all').object('name').inline({
        prepare(object) {
          this.setProperties({ name: object.get('name') });
        }
      })

    });

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'otter' ]);

    let otterModel = subject.get('models.firstObject');
    assert.ok(otterModel);

    subject.get('all').insertAt(0, duck);

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck', 'otter' ]);

    let duckModel = subject.get('models').objectAt(0);
    assert.ok(!duckModel.isDestroying);

    run(() => subject.get('all').removeAt(0));
    assert.ok(duckModel.isDestroying);

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'otter' ]);

    assert.ok(subject.get('models.firstObject') === otterModel);

    run(() => subject.destroy());

    assert.ok(otterModel.isDestroying);
  });

  test('object dependencies recreate models', async function(assert) {
    let duck = this.object({ name: 'duck' });
    let hamster = this.object({ name: 'hamster' });
    let otter = this.object({ name: 'otter' });

    let subject = this.subject({
      all: A([ duck, hamster, otter ]),
      models: models('all').object('name').inline({
        prepare(object) {
          this.setProperties({ name: object.get('name') });
        }
      })
    });

    let start = subject.get('models').slice();
    assert.deepEqual(start.mapBy('name'), [ 'duck', 'hamster', 'otter' ]);

    let first = subject.get('models').objectAt(1);
    assert.equal(first.get('name'), 'hamster');

    run(() => hamster.set('name', 'The Hamster'));

    assert.ok(first.isDestroying);
    assert.deepEqual(start.map(i => i.isDestroying), [ false, true, false ]);

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck', 'The Hamster', 'otter' ]);

    run(() => subject.destroy());
  });

  test('owner dependencies recreate models', async function(assert) {
    let subject = this.subject({
      all: A([ this.object({ name: 'duck' }) ]),
      type: 'nice',
      models: models('all').owner('type').inline({
        prepare(object, owner) {
          this.setProperties({
            name: object.get('name'),
            type: owner.get('type')
          });
        }
      })
    });

    let first = subject.get('models').objectAt(0);
    assert.equal(first.get('type'), 'nice');

    run(() => subject.set('type', 'awesome'));

    assert.ok(first.isDestroying);

    let second = subject.get('models').objectAt(0);
    assert.equal(second.get('type'), 'awesome');

    run(() => subject.destroy());
  });

  test('source starts as null', async function(assert) {
    let subject = this.subject({
      all: null,
      models: models('all').inline({
        prepare(object) {
          this.setProperties({ name: object.name });
        }
      })
    });

    assert.deepEqual(subject.get('models').mapBy('name'), []);

    subject.set('all', A([ this.object({ name: 'duck' }) ]));

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck' ]);

    run(() => subject.destroy());
  });

  test('source becomes null', async function(assert) {
    let subject = this.subject({
      all: A([ this.object({ name: 'duck' }) ]),
      models: models('all').inline({
        prepare(object) {
          this.setProperties({ name: object.name });
        }
      })
    });

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'duck' ]);
    subject.set('all', null);
    assert.deepEqual(subject.get('models').mapBy('name'), []);

    run(() => subject.destroy());
  });

});

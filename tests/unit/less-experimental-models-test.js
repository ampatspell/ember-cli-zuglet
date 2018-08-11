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

    let start = A(subject.get('models').slice());
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

    let first = subject.get('models.firstObject');

    run(() => subject.set('all', null));

    assert.deepEqual(subject.get('models').mapBy('name'), []);

    assert.ok(first.isDestroying);

    run(() => subject.destroy());
  });

  test('mapping is used', async function(assert) {
    let subject = this.subject({

      all: A([ this.object({ name: 'duck' }) ]),
      color: 'yellow',

      models: models('all').inline({
        prepare({ name, color }) {
          this.setProperties({ name, color });
        }
      }).mapping((object, owner) => {
        let name = object.get('name');
        let color = owner.get('color');
        return { name, color };
      })

    });

    let first = subject.get('models.firstObject');

    assert.equal(first.get('name'), 'duck');
    assert.equal(first.get('color'), 'yellow');

    run(() => subject.destroy());
  });

  test('noop changes are not propogated', async function(assert) {
    let object = [ this.object({ name: 'duck' }) ];
    let subject = this.subject({

      all: A(object),
      color: 'yellow',

      models: models('all').owner('color').object('name').inline({
        prepare() {
        }
      })

    });

    let first = subject.get('models.firstObject');

    subject.set('color', 'yellow');
    object.set('name', 'duck');

    assert.ok(!first.isDestroying);

    run(() => subject.destroy());
  });

  test('statically named model', async function(assert) {
    this.registerModel('duck', EmberObject.extend({
      modelName: 'duck',
      prepare(object) {
        let name = object.get('name');
        this.setProperties({ name });
      }
    }));

    let subject = this.subject({
      all: A([ this.object({ name: 'hamster' }) ]),
      models: models('all').named('duck')
    });

    let first = subject.get('models.firstObject');

    assert.equal(first.get('modelName'), 'duck');
    assert.equal(first.get('name'), 'hamster');

    run(() => subject.destroy());
  });

  test('dynamically named model', async function(assert) {
    let Model = EmberObject.extend({
      prepare(object) {
        let name = object.get('name');
        this.setProperties({ name });
      }
    });

    this.registerModel('awesome/hamster', Model.extend({
      modelName: 'awesome/hamster'
    }));

    this.registerModel('cute/hamster', Model.extend({
      modelName: 'cute/hamster'
    }));

    this.registerModel('cute/duck', Model.extend({
      modelName: 'cute/duck'
    }));

    let object = this.object({ name: 'hamster' });

    let subject = this.subject({
      type: 'awesome',
      all: A([ object ]),
      models: models('all').owner('type').object('name').named((object, owner) => {
        let name = object.get('name');
        let type = owner.get('type');
        return `${type}/${name}`;
      })
    });

    let first = subject.get('models.firstObject');
    assert.equal(first.get('modelName'), 'awesome/hamster');

    run(() => subject.set('type', 'cute'));

    assert.ok(first.isDestroying);

    let second = subject.get('models.firstObject');
    assert.equal(second.get('modelName'), 'cute/hamster');

    run(() => object.set('name', 'duck'));

    assert.ok(second.isDestroying);

    let third = subject.get('models.firstObject');
    assert.equal(third.get('modelName'), 'cute/duck');

    run(() => subject.destroy());
  });

  test('model class lookup yields null', async function(assert) {
    this.registerModel('duck', EmberObject.extend({
      prepare(object) {
        this.setProperties(object.getProperties('name'));
      }
    }));

    let yellow = this.object({ type: 'duck', name: 'yellow' });
    let green = this.object({ type: null, name: 'green' });
    let red = this.object({ type: 'duck', name: 'red' });

    let subject = this.subject({
      all: A([ yellow, green, red ]),
      models: models('all').object('type').named(object => object.get('type'))
    });

    let map = () => subject.get('models').map(i => i ? i.get('name') : i);

    assert.deepEqual(map(), [ 'yellow', null, 'red' ]);

    let first = subject.get('models').slice();

    green.set('type', 'duck');

    assert.deepEqual(map(), [ 'yellow', 'green', 'red' ]);

    assert.ok(!first[0].isDestroying);
    assert.ok(!first[2].isDestroying);

    let second = subject.get('models').slice();

    run(() => green.set('type'));

    assert.deepEqual(map(), [ 'yellow', null, 'red' ]);

    assert.ok(!second[0].isDestroying);
    assert.ok(second[1].isDestroying);
    assert.ok(!second[2].isDestroying);

    run(() => subject.destroy());

    assert.ok(second[0].isDestroying);
    assert.ok(second[2].isDestroying);
  });

  test('default prepare for mapping', async function(assert) {
    let subject = this.subject({
      message: 'hello',
      array: A([ EmberObject.create() ]),
      model: models('array').inline({
      }).mapping((doc, owner) => {
        let message = owner.get('message');
        return { message };
      })
    });
    assert.equal(subject.get('model.message', 'hello'));
  });

  test('prepare is required if no mapping', async function(assert) {
    let subject = this.subject({
      message: 'hello',
      array: A([ EmberObject.create() ]),
      model: models('array').inline({})
    });
    try {
      subject.get('model').slice();
    } catch(err) {
      assert.equal(err.message, `Assertion Failed: models require 'prepare' function if mapping is not provided`);
    }
  });

  test('object property changes does not recreate model multiple times', async function(assert) {
    let doc = EmberObject.create({ name: 'duck', color: 'yellow' });
    let log = [];

    let subject = this.subject({
      array: A([ doc ]),
      model: models('array').object('name', 'color').inline({}).mapping(doc => {
        let { name, color } = doc.getProperties('name', 'color');
        log.push([ name, color ]);
        return { name, color };
      })
    });

    const stringify = arr => arr.map(i => `${i.get('name')}/${i.get('color')}`);

    let first = subject.get('model').slice();
    assert.deepEqual(stringify(first), [ 'duck/yellow' ]);

    run(() => doc.setProperties({ name: 'hamster', color: 'brown' }));

    let second = subject.get('model').slice();
    assert.deepEqual(stringify(second), [ 'hamster/brown' ]);

    run(() => subject.destroy());

    assert.deepEqual(log, [
      [ "duck", "yellow" ],
      [ "hamster", "brown" ]
    ]);
  });

  test('owner prop changes does not recreate models multiple times', async function(assert) {
    let doc = EmberObject.create({});
    let log = [];

    let subject = this.subject({
      array: A([ doc ]),
      name: 'duck',
      color: 'yellow',
      model: models('array').owner('name', 'color').inline({}).mapping((doc, owner) => {
        let { name, color } = owner.getProperties('name', 'color');
        log.push([ name, color ]);
        return { name, color };
      })
    });

    const stringify = arr => arr.map(i => `${i.get('name')}/${i.get('color')}`);

    let first = subject.get('model').slice();
    assert.deepEqual(stringify(first), [ 'duck/yellow' ]);

    run(() => subject.setProperties({ name: 'hamster', color: 'brown' }));

    let second = subject.get('model').slice();
    assert.deepEqual(stringify(second), [ 'hamster/brown' ]);

    run(() => subject.destroy());

    assert.deepEqual(log, [
      [ "duck", "yellow" ],
      [ "hamster", "brown" ]
    ]);
  });

});

import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import ArrayObserver from 'ember-cli-zuglet/-private/less-experimental/util/array-observer';
import { A } from '@ember/array';

module('less-experimental-array-observer', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.object = props => EmberObject.create(props);
    this.observer = (array, keys) => {
      let log = A();
      let observer = new ArrayObserver({
        array,
        observe: keys,
        delegate: {
          added: (objects, start, count) => {
            log.push([ 'added', objects, start, count ]);
          },
          removed: (objects, start, count) => {
            log.push([ 'removed', objects, start, count ]);
          },
          updated: (o, key) => {
            log.push([ 'updated', o, key ])
          }
        }
      });

      return { log, observer };
    };
  });

  test('observation not enabled if there is no keys to observe', async function(assert) {
    let array = A();
    let { log, observer } = this.observer(array, []);

    assert.equal(observer._enabled, false);

    observer.destroy();
    assert.equal(log.length, 0);
  });

  test('enabled if there are observation keys', async function(assert) {
    let array = A();
    let { log, observer } = this.observer(array, [ 'name', 'color' ]);

    assert.equal(observer._enabled, true);

    observer.destroy();
    assert.equal(log.length, 0);
  });

  test('object added and removed', async function(assert) {
    let array = A();

    let { log, observer } = this.observer(array, [ 'name', 'color' ]);

    let duck = this.object({ name: 'duck' });
    let hamster = this.object({ name: 'hamster' });
    let otter = this.object({ name: 'otter' });

    array.pushObject(duck);
    array.pushObjects([ hamster ]);
    array.clear();
    array.pushObject(otter);
    array.pushObjects([ duck, hamster ]);
    array.clear();

    assert.deepEqual(log, [
      [ 'added', [ duck ], 0, 1 ],
      [ 'added', [ hamster ], 1, 1 ],
      [ 'removed', [ duck, hamster ], 0, 2 ],
      [ 'added', [ otter ], 0, 1 ],
      [ 'added', [ duck, hamster ], 1, 2 ],
      [ 'removed', [ otter, duck, hamster ], 0, 3 ],
    ]);

    observer.destroy();
  });

  test('added objects are observed', async function(assert) {
    let array = A();

    let { log, observer } = this.observer(array, [ 'name', 'color' ]);

    let duck = this.object({ name: 'duck' });

    array.pushObject(duck);
    duck.set('name', 'ducky');
    array.removeAt(0);

    duck.set('name', 'duck');

    array.pushObject(duck);
    duck.set('name', 'ducky');

    observer.destroy();

    duck.set('name', 'duck');

    assert.deepEqual(log, [
      [ 'added', [ duck ], 0, 1 ],
      [ 'updated', duck, 'name' ],
      [ 'removed', [ duck ], 0, 1 ],
      [ 'added', [ duck ], 0, 1 ],
      [ 'updated', duck, 'name' ]
    ]);
  });

});

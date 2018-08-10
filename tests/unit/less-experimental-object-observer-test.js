import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import ObjectObserver from 'ember-cli-zuglet/-private/less-experimental/util/object-observer';
import { A } from '@ember/array';

module('less-experimental-object-observer', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function(assert) {
    this.object = props => EmberObject.create(props);
    this.observer = (object, keys) => {
      let log = A();
      let observer = new ObjectObserver({
        object,
        observe: keys,
        delegate: {
          updated: (o, key) => {
            assert.ok(o === object);
            log.push(key);
          }
        }
      });

      return { log, observer };
    };
  });

  test('observation not enabled if there is no keys to observe', async function(assert) {
    let object = this.object({ name: 'duck', color: 'yellow' });
    let { log, observer } = this.observer(object, []);

    assert.equal(observer._enabled, false);

    observer.destroy();
    assert.equal(log.length, 0);
  });

  test('enabled if there are observation keys', async function(assert) {
    let object = this.object({ name: 'duck', color: 'yellow' });
    let { log, observer } = this.observer(object, [ 'name', 'color' ]);

    assert.equal(observer._enabled, true);

    observer.destroy();
    assert.equal(log.length, 0);
  });

  test('observe property changes until destroyed', async function(assert) {
    let object = this.object({ name: 'duck', color: 'yellow' });
    let { log, observer } = this.observer(object, [ 'name', 'color' ]);

    assert.deepEqual(log, []);

    object.setProperties({ name: 'duck', color: 'yellow' });
    assert.deepEqual(log, []);

    object.setProperties({ name: 'hamster', color: 'brown' });
    assert.deepEqual(log, [ 'name', 'color' ]);

    observer.destroy();

    object.setProperties({ name: 'duck', color: 'green' });
    assert.deepEqual(log, [ 'name', 'color' ]);
  });

});

import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { models, activate } from 'zuglet/decorators';
import { isActivated, load } from 'zuglet/utils';
import { dedupeTracked } from 'tracked-toolbox';
import { replaceCollection } from '../helpers/util';

module('decorators / @models', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    let created = [];
    this.created = created;

    this.registerModel('duck', class Model extends EmberObject {

      type = 'duck'

      init() {
        super.init(...arguments);
        created.push('duck');
      }

      mappingDidChange() {
        assert.ok(false, 'mappingDidChange for duck');
      }

    });

    this.registerModel('hamster', class Model extends EmberObject {

      type = 'hamster'

      init() {
        super.init(...arguments);
        created.push('hamster');
      }

      mappingDidChange() {
        assert.ok(false, 'mappingDidChange for hamster');
      }

    });

    this.define = Box => {
      let { store } = this;
      this.registerModel('box', Box);
      return store.models.create('box', { store });
    }
  });

  test('create models from query', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: '1', pos: 1, type: 'duck', name: 'One', visible: true },
      { _id: '2', pos: 2, type: 'duck', name: 'Two', visible: true },
      { _id: '3', pos: 3, type: 'duck', name: 'Three', visible: true },
    ]);

    let box = this.define(class Box extends EmberObject {

      @dedupeTracked
      visible = true

      @activate().content(({ store, visible }) => store.collection('ducks').where('visible', '==', visible).query())
      query

      @models().source(({ query }) => query.content).named(doc => doc.data.type).mapping(doc => ({ doc }))
      models

    });

    this.activate(box);
    await load(box.query);

    assert.ok(box.models);
    assert.strictEqual(box.models.length, 3);
    assert.deepEqual(this.created, [ 'duck', 'duck', 'duck' ]);

    let duck = box.models[0];

    await ref.doc('1').save({ type: 'hamster' }, { merge: true });

    assert.ok(box.models);
    assert.deepEqual(this.created, [ 'duck', 'duck', 'duck', 'hamster' ]);

    assert.ok(!isActivated(duck));
  });

});

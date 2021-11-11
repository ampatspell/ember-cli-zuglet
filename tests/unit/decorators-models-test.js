import { module, test, setupStoreTest } from '../helpers/setup';
import ZugletObject, { setProperties } from 'zuglet/object';
import { models, activate } from 'zuglet/decorators';
import { isActivated, load } from 'zuglet/utils';
import { dedupeTracked } from 'tracked-toolbox';
import { replaceCollection, poll } from '../helpers/util';

module('decorators / @models', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    let created = [];
    this.created = created;

    this.registerModel('duck', class Model extends ZugletObject {

      type = 'duck'

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
        created.push('duck');
      }

      mappingDidChange() {
        assert.ok(false, 'mappingDidChange for duck');
      }

    });

    this.registerModel('hamster', class Model extends ZugletObject {

      type = 'hamster'

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
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

    let box = this.define(class Box extends ZugletObject {

      @dedupeTracked
      visible = true

      @activate().content(({ store, visible }) => store.collection('ducks').where('visible', '==', visible).query())
      query

      @models().source(({ query }) => query.content).named(doc => doc.data.type).mapping(doc => ({ doc }))
      models

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    this.activate(box);
    await load.cached(box.query);

    assert.ok(box.models);
    assert.strictEqual(box.models.length, 3);
    assert.deepEqual(this.created, [ 'duck', 'duck', 'duck' ]);

    let duck = box.models[0];

    await ref.doc('1').save({ type: 'hamster' }, { merge: true });
    await poll(() => box.query.content[0].data.type === 'hamster');

    assert.deepEqual(box.models.map(model => model.type), [ 'hamster', 'duck', 'duck' ]);
    assert.deepEqual(this.created, [ 'duck', 'duck', 'duck', 'hamster' ]);

    assert.ok(!isActivated(duck));
  });

  test('create and remove models from query', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'one', pos: 1, type: 'duck', name: 'One', visible: true }
    ]);

    let box = this.define(class Box extends ZugletObject {

      @activate().content(({ store }) => store.collection('ducks').query())
      query

      @models().source(({ query }) => query.content).named(doc => doc.data.type).mapping(doc => ({ doc }))
      models

      constructor(owner, args) {
        super(owner);
        setProperties(this, args);
      }

    });

    this.activate(box);

    await load.cached(box.query);

    assert.deepEqual(box.models.map(model => model.doc.id), [ 'one' ]);

    await replaceCollection(ref, [
      { _id: 'two', pos: 1, type: 'duck', name: 'Two', visible: true }
    ]);

    await box.query.load();

    assert.deepEqual(box.models.map(model => model.doc.id), [ 'two' ]);
  });

});

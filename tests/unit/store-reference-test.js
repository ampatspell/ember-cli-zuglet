import { module, test, setupStoreTest } from '../helpers/setup';

module('store / reference', function(hooks) {
  setupStoreTest(hooks);

  test(`doc with path`, function(assert) {
    let ref = this.store.doc('ducks/yellow');
    assert.ok(ref);
    assert.strictEqual(ref.path, 'ducks/yellow');
    assert.strictEqual(ref.id, 'yellow');
    assert.ok(ref.parent);
    assert.strictEqual(ref.parent.path, 'ducks');
    assert.deepEqual(ref.serialized, {
      id: 'yellow',
      path: 'ducks/yellow'
    });
  });

  test('doc collection', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    let coll = doc.collection('feathers');
    assert.ok(coll);
    assert.deepEqual(coll.serialized, {
      id: 'feathers',
      path: 'ducks/yellow/feathers'
    });
    assert.ok(coll.parent);
    assert.strictEqual(coll.parent.path, 'ducks/yellow');
  });

  test('root collection', function(assert) {
    let coll = this.store.collection('feathers');
    assert.ok(coll);
    assert.deepEqual(coll.serialized, {
      id: 'feathers',
      path: 'feathers'
    });
    assert.strictEqual(coll.parent, null);
  });

  test('collection doc', function(assert) {
    let coll = this.store.collection('ducks');
    let doc = coll.doc('yellow');
    assert.ok(doc);
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow'
    });
  });

  test('root doc without path', function(assert) {
    try {
      this.store.doc();
    } catch(err) {
      assert.strictEqual(err.message, `Assertion Failed: argument must be string not 'undefined'`);
    }
  });

  test('root collection without path', function(assert) {
    try {
      this.store.collection();
    } catch(err) {
      assert.strictEqual(err.message, `Assertion Failed: argument must be string not 'undefined'`);
    }
  });

  test('collection doc without path', function(assert) {
    let doc = this.store.collection('ducks').doc();
    assert.ok(doc.id);
    assert.strictEqual(doc.parent.path, 'ducks');
  });

  // doc
  //  load
  //  new
  //  existing
  // queryable
  //  conditions
  //  query
  //  load
  //  first

});

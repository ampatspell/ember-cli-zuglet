import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';
import DocumentReference from 'zuglet/-private/store/firestore/references/document';
import Document from 'zuglet/-private/store/firestore/document';

module('firestore / reference', function(hooks) {
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

  test('doc toStringExtension', function(assert) {
    assert.strictEqual(this.store.doc('ducks/yellow').toStringExtension(), 'ducks/yellow');
  });

  test('coll toStringExtension', function(assert) {
    assert.strictEqual(this.store.collection('ducks/yellow/feathers').toStringExtension(), 'ducks/yellow/feathers');
  });

  test('coll string', function(assert) {
    assert.strictEqual(this.store.collection('ducks/yellow/feathers').string, 'ducks/yellow/feathers');
  });

  test('missing doc load', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();

    try {
      await ref.load();
    } catch(err) {
      assert.strictEqual(err.message, `Document 'ducks/yellow' missing`);
      assert.strictEqual(err.code, `zuglet/document/missing`);
    }
  });

  test('missing optional doc load', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();
    let doc = await ref.load({ optional: true });
    assert.strictEqual(doc, undefined);
  });

  test('toJSON', function(assert) {
    let ref = this.store.doc('ducks/yellow');
    let json = ref.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        id: 'yellow',
        path: 'ducks/yellow'
      }
    });
    assert.ok(json.instance.startsWith('zuglet@store/firestore/reference/document::ember'));
  });

  test('condition toStringExtension', function(assert) {
    let ref = this.store.collection('ducks').where('name', '==', 'yellow').limit(1);
    assert.equal(ref.toStringExtension(), `ducks.where('name', '==', 'yellow').limit(1)`);
  });

  test('condition serialized', function(assert) {
    let ref = this.store.collection('ducks').where('name', '==', 'yellow').limit(1);
    assert.deepEqual(ref.serialized, {
      string: `ducks.where('name', '==', 'yellow').limit(1)`
    });
  });

  test('query load', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
    ]);
    let coll = ref.orderBy('name', 'asc');
    let docs = await coll.load();
    assert.ok(docs[0] instanceof Document);
    assert.ok(docs[1] instanceof Document);
    assert.deepEqual(docs.map(doc => doc.id), [ 'green', 'yellow' ]);
  });

  test('query first', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
    ]);
    let coll = ref.orderBy('name', 'asc').limit(1);
    let doc = await coll.first();
    assert.ok(doc instanceof Document);
    assert.strictEqual(doc.id, 'green');
  });

  test('query first missing', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref);
    let coll = ref.where('name', '==', 'red').limit(1);
    try {
      await coll.first();
    } catch(err) {
      assert.equal(err.message, 'Document missing');
      assert.equal(err.code, 'zuglet/document/missing');
    }
  });

  test('query first missing optional', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref);
    let coll = ref.where('name', '==', 'red').limit(1);
    let doc = await coll.first({ optional: true });
    assert.strictEqual(doc, undefined);
  });

  test('query load ref', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
    ]);
    let coll = ref.orderBy('name', 'asc');
    let refs = await coll.load({ type: 'ref' });
    assert.ok(refs[0] instanceof DocumentReference);
    assert.ok(refs[1] instanceof DocumentReference);
    assert.deepEqual(refs.map(ref => ref.id), [ 'green', 'yellow' ]);
  });

  test('query first ref', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
    ]);
    let coll = ref.orderBy('name', 'asc').limit(1);
    let doc = await coll.first({ type: 'ref' });
    assert.ok(doc instanceof DocumentReference);
    assert.strictEqual(doc.id, 'green');
  });

});

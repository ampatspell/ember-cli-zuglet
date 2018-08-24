import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { all } from 'rsvp';

module('references', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('collection', function(assert) {
    let coll = this.store.collection('ducks');
    assert.ok(coll);
    assert.equal(coll.get('id'), 'ducks');
    assert.equal(coll.get('parent'), undefined);
  });

  test('parents', function(assert) {
    let coll = this.store.collection('ducks/yellow/feathers');
    assert.ok(coll);
    assert.equal(coll.get('id'), 'feathers');
    assert.equal(coll.get('path'), 'ducks/yellow/feathers');

    let parent = coll.get('parent');
    assert.ok(parent);
    assert.equal(parent.get('id'), 'yellow');
    assert.equal(parent.get('path'), 'ducks/yellow');

    let root = parent.get('parent');
    assert.ok(root);
    assert.equal(root.get('id'), 'ducks');
    assert.equal(root.get('path'), 'ducks');

    assert.equal(root.get('parent'), null);
  });

  test('parents are reused', function(assert) {
    let ducks = this.store.collection('ducks');
    let doc = ducks.doc('yellow');
    let feathers = doc.collection('feathers');
    let where = feathers.where('name', '==', 'qwe');
    let limit = where.limit(1);
    assert.ok(feathers.get('parent') === doc);
    assert.ok(doc.get('parent') === ducks);
    assert.ok(where.get('parent') === feathers);
    assert.ok(limit.get('parent') === where);
    assert.deepEqual(limit.get('serialized'), [
      { "type": "collection", "id": "ducks" },
      { "type": "document", "id": "yellow" },
      { "type": "collection", "id": "feathers" },
      { "type": "query", "id": "where", "args": [ "name", "==", "qwe" ] },
      { "type": "query", "id": "limit", "args": [ 1 ] }
    ]);
    assert.equal(limit.get('_internal.string'), 'ducks/yellow/feathers.where(name, ==, qwe).limit(1)');
  });

  test('childs', function(assert) {
    let coll = this.store.collection('ducks');

    let doc = coll.doc('yellow');
    assert.ok(doc);
    assert.equal(doc.get('path'), 'ducks/yellow');

    let nested = doc.collection('feathers');
    assert.ok(nested);
    assert.equal(nested.get('path'), 'ducks/yellow/feathers');

    let gen = nested.doc();
    assert.ok(gen.get('path').startsWith('ducks/yellow/feathers/'));
    assert.ok(gen.get('path').length > 'ducks/yellow/feathers/'.length + 19);
  });

  test('store doc', function(assert) {
    let doc = this.store.doc('ducks/yellow/feathers/first');
    assert.ok(doc);
    assert.equal(doc.get('path'), 'ducks/yellow/feathers/first');
  });

  test('store coll', function(assert) {
    let doc = this.store.collection('ducks/yellow/feathers').doc('first');
    assert.ok(doc);
    assert.equal(doc.get('path'), 'ducks/yellow/feathers/first');
  });

  test('coll query', function(assert) {
    let query = this.store.collection('ducks').orderBy('name', 'asc').limit(10);
    assert.ok(query);
  });

  test('create query from query ref', async function(assert) {
    await this.recreate();
    await all([
      this.coll.doc('yellow').set({ name: 'yellow' }),
      this.coll.doc('green').set({ name: 'green' }),
      this.coll.doc('blue').set({ name: 'blue' })
    ]);

    let ref = this.store.collection('ducks').orderBy('name', 'asc').limit(2);

    let query = ref.query({ type: 'array' });
    assert.ok(query);

    await query.load();

    assert.deepEqual(query.get('content').mapBy('data.name'), [
      'blue',
      'green'
    ]);
  });

  test('load from query ref', async function(assert) {
    await this.recreate();
    await all([
      this.coll.doc('yellow').set({ name: 'yellow' }),
      this.coll.doc('green').set({ name: 'green' }),
      this.coll.doc('blue').set({ name: 'blue' })
    ]);

    let ref = this.store.collection('ducks').orderBy('name', 'asc').limit(2);

    let content = await ref.load();

    assert.deepEqual(content.mapBy('data.name'), [
      'blue',
      'green'
    ]);
  });

  test('doc delete', async function(assert) {
    await this.recreate();

    let yellow = this.store.doc('ducks/yellow');

    await yellow.new({ name: 'yellow' }).save();
    let result = await yellow.delete();
    assert.ok(result === yellow);

    let doc = await yellow.load({ optional: true });
    assert.equal(doc.get('exists'), false);
  });

  test('doc delete missing', async function(assert) {
    await this.recreate();

    let yellow = this.store.doc('ducks/yellow');

    await yellow.delete();
    await yellow.delete();

    let doc = await yellow.load({ optional: true });
    assert.equal(doc.get('exists'), false);
  });

  test('doc to doc reference', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    let profile = doc.doc('images/profile');
    assert.equal(profile.get('path'), 'ducks/yellow/images/profile');
    assert.equal(profile.get('parent.parent'), doc);
  });

  test('doc to doc reference with generated id', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    let profile = doc.doc('images');
    assert.ok(profile.get('id'));
    assert.equal(profile.get('path'), `ducks/yellow/images/${profile.get('id')}`);
  });

  test('doc to doc reference throws on invalid component count', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    try {
      doc.doc('images/profile/weird');
    } catch(err) {
      assert.equal(err.code, 'invalid-argument');
    }
  });

  test('doc to doc reference blows up if trailing slash is provided', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    try {
      doc.doc('images/');
    } catch(err) {
      assert.equal(err.message, 'Assertion Failed: nested document path cannot contain empty path components');
    }
  });

  test('doc to doc reference blows up if trailing slash is provided', function(assert) {
    let doc = this.store.doc('ducks/yellow');
    try {
      doc.doc('images/profile//original');
    } catch(err) {
      assert.equal(err.message, 'Assertion Failed: nested document path cannot contain empty path components');
    }
  });

  test('parents for nested collection doc references', function(assert) {
    let doc = this.store.collection('ducks').doc('yellow/feathers/white');
    assert.equal(doc.get('id'), 'white');
    assert.equal(doc.get('parent.id'), 'feathers');
    assert.equal(doc.get('parent.parent.id'), 'yellow');
    assert.equal(doc.get('parent.parent.parent.id'), 'ducks');
  });

  test('parent for doc nested collection references', function(assert) {
    let doc = this.store.doc('ducks/yellow').collection('orders/first/products');
    assert.equal(doc.get('id'), 'products');
    assert.equal(doc.get('parent.id'), 'first');
    assert.equal(doc.get('parent.parent.id'), 'orders');
    assert.equal(doc.get('parent.parent.parent.id'), 'yellow');
    assert.equal(doc.get('parent.parent.parent.parent.id'), 'ducks');
  });

  test('parent for doc nested doc references', function(assert) {
    let doc = this.store.doc('ducks/yellow').doc('orders/first');
    assert.equal(doc.get('id'), 'first');
    assert.equal(doc.get('parent.id'), 'orders');
    assert.equal(doc.get('parent.parent.id'), 'yellow');
    assert.equal(doc.get('parent.parent.parent.id'), 'ducks');
  });

});

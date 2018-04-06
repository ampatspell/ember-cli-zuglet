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

    let query = ref.query();
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

  test('doc create', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new();

    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "data": {
      },
      "error": null,
      "exists": undefined,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isObserving": false,
      "metadata": undefined,
    });
  });

});

import { module, test, setupStoreTest } from '../helpers/setup';

module('references', function(hooks) {
  setupStoreTest(hooks);

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

});

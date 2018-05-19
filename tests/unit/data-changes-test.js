import { module, test, setupStoreTest } from '../helpers/setup';

module('data-changes', function(hooks) {
  setupStoreTest(hooks);

  test('set primitive', function(assert) {
    let object = this.store.object({ name: 'foo' });
    let internal = object._internal;

    assert.equal(internal.get('isDirty'), false);

    object.set('name', 'bar');
    assert.equal(internal.get('isDirty'), true);

    internal.update({ name: 'bar' });
    assert.equal(internal.get('isDirty'), false);

    internal.fetch();
    assert.equal(internal.get('isDirty'), false);

    object.set('name', 'bar');
    assert.equal(internal.get('isDirty'), false);

    internal.update({ name: 'updated' });
    assert.equal(internal.get('isDirty'), true);

    object.set('name', 'updated');
    assert.equal(internal.get('isDirty'), false);
  });

  test('nested object', function(assert) {
    let object = this.store.object({ address: { street: 'foobar' } });
    let internal = object._internal;

    assert.equal(internal.get('isDirty'), false);

    object.set('address.street', 'bar');
    assert.equal(internal.get('isDirty'), true);

    object.set('address', { street: 'foobar' });
    assert.equal(internal.get('isDirty'), false);

    object.set('address.country', 'Latvia');
    assert.equal(internal.get('isDirty'), true);
  });

  test('array', function(assert) {
    let object = this.store.object({ names: [ { name: 'one' }, { name: 'two' } ] });
    let internal = object._internal;

    assert.equal(internal.get('isDirty'), false);

    object.get('names').pushObject({ name: 'three' });
    assert.equal(internal.get('isDirty'), true);

    object.get('names').removeAt(2);
    assert.equal(internal.get('isDirty'), false);

    object.get('names.lastObject').set('name', 'foo');
    assert.equal(internal.get('isDirty'), true);

    object.get('names.lastObject').set('name', 'two');
    assert.equal(internal.get('isDirty'), false);
  });

  test('reference', function(assert) {
    let object = this.store.object({ ref: this.store.doc('foo/bar') });
    let internal = object._internal;

    assert.equal(internal.get('isDirty'), false);

    object.set('ref', this.store.doc('foo/baz'));
    assert.equal(internal.get('isDirty'), true);

    object.set('ref', this.store.doc('foo/bar'));
    assert.equal(internal.get('isDirty'), false);
  });

  test('timestamp', function(assert) {
    let date = new Date();

    let object = this.store.object({ date });
    let internal = object._internal;

    assert.equal(internal.get('isDirty'), false);

    object.set('date', new Date());
    assert.equal(internal.get('isDirty'), true);

    object.set('date', date);
    assert.equal(internal.get('isDirty'), false);
  });

});

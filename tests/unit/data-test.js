import { module, test, setupStoreTest } from '../helpers/setup';
import { all } from 'rsvp';
import DataObject from 'ember-cli-zuglet/-private/data/object/object';

module('data', function(hooks) {
  setupStoreTest(hooks);

  test('create object', function(assert) {
    let object = this.store.object();
    assert.ok(object);
    assert.ok(object._internal);
  });

  test('set primitive value for object', function(assert) {
    let obj = this.store.object();
    obj.set('name', 'duck');
    assert.equal(obj.get('name'), 'duck');
  });

  test('set object value for object', function(assert) {
    let obj = this.store.object();
    obj.set('address', { city: 'duckland' });
    let address = obj.get('address');
    assert.ok(DataObject.detectInstance(address));
  });

});

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

  test('create primitive', function(assert) {
    let serializer = this.store._internal.get('dataManager').serializerForName('primitive');
    let internal = serializer.deserialize('hey');
    assert.ok(internal);
    assert.equal(internal.model(true), 'hey');
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

  test('set object model as a value for object', function(assert) {
    let address = this.store.object({ city: 'duckland' });
    assert.equal(address.get('city'), 'duckland');

    let obj = this.store.object();
    obj.set('address', address);

    let got = obj.get('address');
    assert.ok(got === address);
  });

});

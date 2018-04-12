import { module, test, setupStoreTest } from '../helpers/setup';
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

  test('object checkpoint', function(assert) {
    let address = this.store.object({ city: 'duckland' });

    let pristine = address._internal.content.pristine;
    let values = address._internal.content.values;

    let city = pristine.city;
    let city_ = city;

    assert.ok(city.parent === address._internal);

    assert.ok(pristine.city);
    assert.ok(values.city);
    assert.ok(pristine.city === values.city);

    address.set('city', 'another');

    assert.ok(pristine.city);
    assert.ok(values.city);
    assert.ok(pristine.city !== values.city);

    assert.ok(city.parent === address._internal);

    city = values.city;

    assert.ok(city.parent === address._internal);

    address._internal.checkpoint();

    assert.ok(pristine.city);
    assert.ok(values.city);
    assert.ok(pristine.city === values.city);

    assert.ok(pristine.city === city);
    assert.ok(city_.parent === null);
  });

  test('object serialized', function(assert) {
    let address = this.store.object({ city: 'duckland' });

    assert.deepEqual(address.get('serialized'), {
      city: 'duckland'
    });

    address.set('country', 'Ducky');

    assert.deepEqual(address.get('serialized'), {
      city: 'duckland',
      country: 'Ducky'
    });

    address.set('country');

    assert.deepEqual(address.get('serialized'), {
      city: 'duckland'
    });

    address.set('city', 'fooland');
    address.set('country', 'Ducky')

    assert.deepEqual(address.get('serialized'), {
      city: 'fooland',
      country: 'Ducky'
    });

    assert.equal(address.get('city'), 'fooland');
    assert.equal(address.get('country'), 'Ducky');

    address._internal.rollback();

    assert.equal(address.get('city'), 'duckland');
    assert.equal(address.get('country'), undefined);

    assert.deepEqual(address.get('serialized'), {
      city: 'duckland'
    });
  });

  test('parent serialized', function(assert) {
    let data = this.store.object({ city: 'Duckland' });

    assert.deepEqual(data.get('serialized'), {
      "city": "Duckland"
    });

    data.set('city');

    data.set('address', {
      city: 'Yellow',
      country: 'Duckland'
    });

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "city": "Yellow",
        "country": "Duckland"
      }
    });

    data.set('address.street', 'Duckstr 1');

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "city": "Yellow",
        "country": "Duckland",
        "street": "Duckstr 1"
      }
    });

    data.set('address.street', { name: 'Duckstr', number: 1 });

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "city": "Yellow",
        "country": "Duckland",
        "street": {
          "name": "Duckstr",
          "number": 1
        }
      }
    });
  });

  test('array create and operations', function(assert) {
    let array = this.store.array([ 'one', 'two' ]);
    assert.ok(array);
    assert.ok(array._internal);
    assert.equal(array.get('length'), 2);

    let values = array._internal.content.values;
    assert.deepEqual(array.map(i => i), [ 'one', 'two' ]);
    assert.equal(values.objectAt(0).content, 'one');
    assert.equal(values.objectAt(1).content, 'two');

    array.pushObject('three');
    assert.deepEqual(array.map(i => i), [ 'one', 'two', 'three' ]);
    assert.equal(values.objectAt(2).content, 'three');

    array.removeObject('two');
    assert.deepEqual(array.map(i => i), [ 'one', 'three' ]);
    assert.equal(values.objectAt(1).content, 'three');

    array.reverseObjects();
    assert.deepEqual(array.map(i => i), [ 'three', 'one' ]);
    assert.equal(values.objectAt(0).content, 'three');
  });

});

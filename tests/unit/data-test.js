import { module, test, setupStoreTest } from '../helpers/setup';
import DataObject from 'ember-cli-zuglet/-private/data/object/object';
import { DateTime } from 'luxon';

module('data', function(hooks) {
  setupStoreTest(hooks);

  test.only('overview with primitives', function(assert) {
    let root = this.store.get('_internal.dataManager').createRootInternalObject();
    let internal = root.internal;
    let object = internal.model(true);

    assert.equal(root.get('isDirty'), false, 'isDirty');

    // set props

    assert.deepEqual(object.get('serialized'), {
    });

    object.set('name', 'zeeba');

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), true, 'isDirty');

    assert.equal(object.get('name'), 'zeeba');
    assert.deepEqual(object.get('serialized'), {
      name: 'zeeba'
    });

    object.setProperties({ name: 'Zeeba', email: 'zeeba@gmail.com' });

    assert.deepEqual(object.get('serialized'), {
      name: 'Zeeba',
      email: 'zeeba@gmail.com'
    });

    let raw = object.serialize('raw');

    assert.deepEqual(raw, {
      name: 'Zeeba',
      email: 'zeeba@gmail.com'
    });

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), true, 'isDirty');

    root.commit(raw);

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), false, 'isDirty');

    object.set('name', 'Zeeba');

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), false, 'isDirty');

    object.set('name', 'zeeba');

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), true, 'isDirty');

    assert.deepEqual(object.get('serialized'), {
      name: 'zeeba',
      email: 'zeeba@gmail.com'
    });

    root.rollback();

    root.dirtyDidChange(); // temporary
    assert.equal(root.get('isDirty'), false, 'isDirty');

    assert.deepEqual(object.get('serialized'), {
      name: 'Zeeba',
      email: 'zeeba@gmail.com'
    });
  });

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

  test('set object model as a value for object', function(assert) {
    let address = this.store.object({ city: 'duckland' });
    assert.equal(address.get('city'), 'duckland');

    let obj = this.store.object();
    obj.set('address', address);

    let got = obj.get('address');
    assert.ok(got === address);
  });

  test('object serialized', function(assert) {
    let address = this.store.object({ city: 'duckland' });

    address._internal.commit({ city: 'duckland' });

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

  test('array notifies parent', function(assert) {
    let data = this.store.object({ names: [ 'yellow', 'green' ]});

    assert.deepEqual(data.get('serialized'), {
      "names": [
        "yellow",
        "green"
      ]
    });

    assert.deepEqual(data.get('names.serialized'), [
      "yellow",
      "green"
    ]);

    data.get('names').pushObject('red');

    assert.deepEqual(data.get('serialized'), {
      "names": [
        "yellow",
        "green",
        "red"
      ]
    });

    assert.deepEqual(data.get('names.serialized'), [
      "yellow",
      "green",
      "red"
    ]);

    data.get('names').clear();

    assert.deepEqual(data.get('serialized'), {
      "names": [
      ]
    });

    assert.deepEqual(data.get('names.serialized'), [
    ]);

    let name = this.store.object({ name: 'Duck' });
    data.get('names').pushObject(name);

    assert.deepEqual(data.get('serialized'), {
      "names": [
        {
          "name": "Duck"
        }
      ]
    });

    assert.deepEqual(data.get('names.serialized'), [
      {
        "name": "Duck"
      }
    ]);

    name.set('name', 'Ducky');

    assert.deepEqual(data.get('serialized'), {
      "names": [
        {
          "name": "Ducky"
        }
      ]
    });

    assert.deepEqual(data.get('names.serialized'), [
      {
        "name": "Ducky"
      }
    ]);
  });

  test('array checkpoint', function(assert) {
    let array = this.store.array([ 'one', 'two', 'three' ]);

    assert.deepEqual(array.map(i => i), [
      "one",
      "two",
      "three"
    ]);

    array.clear();

    assert.deepEqual(array.map(i => i), [
    ]);

    array._internal.fetch();

    assert.deepEqual(array.map(i => i), [
      "one",
      "two",
      "three"
    ]);
  });

  test('nested checkpoint and rollback', function(assert) {
    let data = this.store.object({
      name: 'duck',
      address: {
        lines: [
          { line: 'duckland' },
          { line: '55' }
        ],
        po: {
          value: '123',
          array: [ 'a', 'b', 'c' ]
        }
      }
    });

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "lines": [
          {
            "line": "duckland"
          },
          {
            "line": "55"
          }
        ],
        "po": {
          "array": [
            "a",
            "b",
            "c"
          ],
          "value": "123"
        }
      },
      "name": "duck"
    });

    data.get('address.po.array').pushObject('d');
    data.set('address.po.value', '321');
    data.set('address.lines.lastObject.line', '123');

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "lines": [
          {
            "line": "duckland"
          },
          {
            "line": "123"
          }
        ],
        "po": {
          "array": [
            "a",
            "b",
            "c",
            "d"
          ],
          "value": "321"
        }
      },
      "name": "duck"
    });

    data._internal.fetch();

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "lines": [
          {
            "line": "duckland"
          },
          {
            "line": "55"
          }
        ],
        "po": {
          "array": [
            "a",
            "b",
            "c"
          ],
          "value": "123"
        }
      },
      "name": "duck"
    });
  });

  test('array detach', function(assert) {
    let data = this.store.object({
      ducks: [
        { name: 'yellow' },
        { name: 'green' }
      ]
    });

    let ducks = data.get('ducks');
    assert.ok(ducks._internal.isAttached());

    data.set('ducks');
    assert.ok(!ducks._internal.isAttached());

    data.set('ducks', ducks);
    assert.ok(ducks._internal.isAttached());
  });

  test('array detach items', function(assert) {
    let data = this.store.object({
      ducks: [
        { name: 'yellow' },
        { name: 'green' }
      ]
    });

    let ducks = data.get('ducks');
    let yellow = ducks.get('firstObject');
    assert.ok(yellow._internal.isAttached());

    ducks.removeObject(yellow);
    assert.ok(!yellow._internal.isAttached());

    ducks.pushObject(yellow);
    assert.ok(yellow._internal.isAttached());
  });

  test('set reference', function(assert) {
    let coll = this.store.collection('ducks');
    let doc = this.store.doc('ducks/yellow');
    let data = this.store.object({ coll, doc });

    assert.deepEqual(data.get('serialized'), {
      "coll": "reference:ducks",
      "doc": "reference:ducks/yellow"
    });

    assert.ok(data.get('coll') === coll);
    assert.ok(data.get('doc') === doc);

    let raw = data.serialize('raw');
    assert.ok(raw.coll.isEqual(this.firestore.collection('ducks')));
    assert.ok(raw.doc.isEqual(this.firestore.doc('ducks/yellow')));

    let model = data.serialize('model');
    assert.ok(model.coll === coll);
    assert.ok(model.doc === doc);
  });

  test('set ref', function(assert) {
    let coll = this.firestore.collection('ducks');
    let doc = this.firestore.doc('ducks/yellow');
    let data = this.store.object({ coll, doc });

    assert.deepEqual(data.get('serialized'), {
      "coll": "reference:ducks",
      "doc": "reference:ducks/yellow"
    });

    assert.ok(data.get('coll')._internal.ref === coll);
    assert.ok(data.get('doc')._internal.ref === doc);

    let raw = data.serialize('raw');
    assert.ok(raw.coll.isEqual(coll));
    assert.ok(raw.doc.isEqual(doc));
  });

  test('update object with primitives', function(assert) {
    let data = this.store.object({
      address: {
        city: 'Yeelo',
        box: 101,
      },
      name: 'duck',
      email: 'foo@bar.com',
      ok: true,
    });

    let fetch = () => {
      let values = data._internal.content.values;
      let address = values.address.content.values;
      return {
        address: values.address,
        city: address.city,
        box: address.box,
        name: values.name,
        email: values.email,
        ok: values.ok
      };
    };

    let start = fetch();

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "city": "Yeelo",
        "box": 101,
      },
      "name": "duck",
      "email": "foo@bar.com",
      "ok": true
    });

    data._internal.update({
      address: {
        city: 'Yello',
        country: 'Yellowish',
        box: 101,
      },
      name: 'Duck',
      ok: 'yes'
    }, 'raw');

    data._internal.fetch();

    assert.deepEqual(data.get('serialized'), {
      "address": {
        "city": "Yello",
        "country": "Yellowish",
        "box": 101,
      },
      "name": "Duck",
      "ok": "yes"
    });

    let end = fetch();

    assert.ok(start.address === end.address);
    assert.ok(start.city !== end.city);
    assert.ok(start.box === end.box);
    assert.ok(start.name !== end.name);
    assert.ok(!end.email);
    assert.ok(start.ok !== end.ok);
  });

  test('update reference', function(assert) {
    let data = this.store.object({
      identical: {
        coll: this.store.collection('ducks'),
        doc: this.store.doc('ducks/yellow')
      },
      changed: {
        coll: this.store.collection('hamsters'),
        doc: this.store.doc('hamster/yellow')
      }
    });

    let fetch = () => {
      let values = data._internal.content.values;
      let identical = values.identical.content.values;
      let changed = values.changed.content.values;
      return {
        identical: {
          coll: identical.coll,
          doc: identical.doc
        },
        changed: {
          coll: changed.coll,
          doc: changed.doc
        }
      };
    };

    let start = fetch();

    assert.deepEqual(data.get('serialized'), {
      "changed": {
        "coll": "reference:hamsters",
        "doc": "reference:hamster/yellow"
      },
      "identical": {
        "coll": "reference:ducks",
        "doc": "reference:ducks/yellow"
      }
    });

    data._internal.update({
      identical: {
        coll: data.get('identical')._internal.content.values.coll.content.ref,
        doc: data.get('identical')._internal.content.values.doc.content.ref,
      },
      changed: {
        coll: this.store.collection('zeebas')._internal.ref,
        doc: this.store.doc('zeebas/yellow')._internal.ref,
      }
    });

    data._internal.fetch();

    assert.deepEqual(data.get('serialized'), {
      "changed": {
        "coll": "reference:zeebas",
        "doc": "reference:zeebas/yellow"
      },
      "identical": {
        "coll": "reference:ducks",
        "doc": "reference:ducks/yellow"
      }
    });

    let end = fetch();

    assert.ok(start.identical.coll === end.identical.coll);
    assert.ok(start.identical.doc === end.identical.doc);
    assert.ok(start.changed.coll !== end.changed.coll);
    assert.ok(start.changed.doc !== end.changed.doc);
  });

  test('update array', function(assert) {
    let data = this.store.object({
      array: [
        { name: 'one' },
        { name: 'two' },
        { name: 'three' },
        'four'
      ]
    });

    assert.deepEqual(data.get('serialized'), {
      "array": [
        { "name": "one" },
        { "name": "two" },
        { "name": "three" },
        "four"
      ]
    });

    data._internal.update({
      "array": [
        { "name": "three" },
        { "name": "one" },
        "four",
        "five",
        { "name": "six" }
      ],
      "second": [ 'ok' ]
    });

    data._internal.fetch();

    assert.deepEqual(data.get('serialized'), {
      "array": [
        { "name": "three" },
        { "name": "one" },
        "four",
        "five",
        { "name": "six" }
      ],
      "second": [ 'ok' ]
    });
  });

  test('update array primitives append', function(assert) {
    let data = this.store.object({
      array: [
        'one',
        'two'
      ]
    });

    let fetch = () => data._internal.content.values.array.content.values.map(i => i);

    let start = fetch();

    assert.deepEqual(data.get('serialized'), {
      "array": [
        "one",
        "two"
      ]
    });

    data._internal.update({
      "array": [
        "one",
        "two",
        "three"
      ]
    });

    data._internal.fetch();

    let end = fetch();

    assert.deepEqual(data.get('serialized'), {
      "array": [
        "one",
        "two",
        "three"
      ]
    });

    assert.ok(start[0] === end[0]);
    assert.ok(start[1] === end[1]);
  });

  test('deserialize to pristine', function(assert) {
    let data = this.store.object({
      ok: true
    });

    let fetch = () => {
      let values = data._internal.content.values;
      return {
        ok: values.ok,
        name: values.name
      };
    }

    let start = fetch();

    assert.deepEqual(data.get('serialized'), {
      "ok": true
    });

    data._internal.update({
      ok: true,
      name: 'firestore'
    }, 'raw');

    data._internal.fetch();

    assert.deepEqual(data.get('serialized'), {
      "ok": true,
      "name": "firestore"
    });

    let end = fetch();

    assert.ok(start.ok === end.ok);
    assert.ok(end.name);
  });

  test('deserialize to pristine set object value', function(assert) {
    let data = this.store.object({
      ok: true
    });

    assert.deepEqual(data.get('serialized'), {
      "ok": true
    });

    data.set('ok', false);
    data.set('name', 'firestore');

    assert.deepEqual(data.get('serialized'), {
      "name": "firestore",
      "ok": false
    });
  });

  test('deserialize to pristine array', function(assert) {
    let array = this.store.array([ 'one', 'two' ]);

    assert.deepEqual(array.get('serialized'), [
      "one",
      "two"
    ]);

    array.pushObject('three');

    assert.deepEqual(array.get('serialized'), [
      "one",
      "two",
      "three"
    ]);
  });

  test('server timestamp from model', function(assert) {
    let ts = this.store.serverTimestamp();
    let object = this.store.object({
      now: ts
    });

    let raw = object.serialize('raw');
    assert.ok(raw.now === ts._internal.content);

    assert.deepEqual(object.get('serialized'), {
      "now": "timestamp:server"
    });
  });

  test('save and load date (timestamp)', async function(assert) {
    let date = new Date();
    let saved = this.store.doc('ducks/yellow').new({ date });
    await saved.save();
    assert.equal(saved.get('data.date.date'), date);
    assert.equal(saved.get('data.date.isTimestamp'), true);
    assert.equal(saved.get('data.date.isServerTimestamp'), false);

    let doc = await this.store.doc('ducks/yellow').load();
    assert.equal(doc.get('data.date.date').getTime(), date.getTime());
    assert.equal(doc.get('data.date.isTimestamp'), true);
    assert.equal(doc.get('data.date.isServerTimestamp'), false);

    let second = new Date();
    doc.set('data.date', second);
    await doc.save();

    doc = await this.store.doc('ducks/yellow').load();
    assert.equal(doc.get('data.date.date').getTime(), second.getTime());
    assert.equal(doc.get('data.date.isTimestamp'), true);
    assert.equal(doc.get('data.date.isServerTimestamp'), false);
  });

  test('server timestamp model', async function(assert) {
    let model = this.store.serverTimestamp();
    assert.ok(model);
    assert.ok(model._internal);
    assert.equal(model.get('isTimestamp'), true);
    assert.equal(model.get('isServerTimestamp'), true);
    assert.equal(model.get('date'), null);
  });

  test('timestamp model with date', async function(assert) {
    let date = new Date();
    let object = this.store.object({ date });
    let model = object.get('date');

    assert.equal(model.get('isTimestamp'), true);
    assert.equal(model.get('isServerTimestamp'), false);
    assert.equal(model.get('date'), date);
  });

  test('timestamp from datetime', async function(assert) {
    let datetime = DateTime.local();
    let object = this.store.object({ date: datetime });
    let model = object.get('date');
    assert.equal(model.get('isTimestamp'), true);
    assert.equal(model.get('isServerTimestamp'), false);
    assert.equal(model.get('date').getTime(), datetime.toJSDate().getTime());
    assert.ok(model.get('dateTime').equals(datetime));
  });

});

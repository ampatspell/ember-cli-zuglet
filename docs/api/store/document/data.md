# Data

Wraps plain Firebase document data into Ember.js observable objects and manages document `isDirty` tracking. It also wraps and unwraps Firebase timestamps, server timestamps, document and collection references.

> **Note:** `firebase.firestore.GeoPoint` is not implemened yet.

> **Note:** As of right now it is required to use `Ember.get` to access property values.

``` javascript
let doc = store.doc('ducks/yellow').new();
doc.data.set('name', 'Yellow Duck');
doc.data.set('address', { street: 'Duckystreet 1' });

doc.data.get('name') // → 'Yellow Duck'
doc.data.get('address') // → EmberObject subclass with `street` property
```

## DataObject

### serialized `→ Object`

Returns json representation of document data preview.

Useful for debugging.

``` javascript
let doc = await store.doc('ducks/yellow').new({
  name: 'Yellow Duck',
  address: {
    street: 'Durchführen Straße'
  },
  createdAt: store.serverTimestamp(),
  friend: store.doc('hamsters/cute')
});

doc.data.serialized
// →
// {
//   name: "Yellow Duck",
//   address: {
//     street: 'Durchführen Straße'
//   },
//   createdAt: 'timestamp:server',
//   friend: 'reference:hamsters/cute'
// }
```

> **Note:** This renders non-primitive types as strings for easier debugging

### serialize(type) `→ Object`

* `type`: `raw` `preview` `model`

Returns json representation of document data.

Useful for debugging.

``` javascript
let doc = await store.doc('ducks/yellow').new({
  name: 'Yellow Duck',
  address: {
    street: 'Durchführen Straße'
  },
  createdAt: store.serverTimestamp(),
  friend: store.doc('hamsters/cute')
});

doc.data.serialize('raw')
// →
// {
//   name: "Yellow Duck",
//   address: {
//     street: 'Durchführen Straße'
//   },
//   createdAt: firebase.firestore.ServerTimestampFieldValueImpl
//   friend: firebase.firestore.DocumentReference
// }

doc.data.serialize('model')
// →
// {
//   name: "Yellow Duck",
//   address: {
//     street: 'Durchführen Straße'
//   },
//   createdAt: null,
//   friend: zuglet.DocumentReference
// }

doc.data.serialize('preview')
// →
// {
//   name: "Yellow Duck",
//   address: {
//     street: 'Durchführen Straße'
//   },
//   createdAt: 'timestamp:server',
//   friend: 'reference:hamsters/cute'
// }
```

## DataArray `extends Array`

``` javascript
let doc = store.doc('ducks/yellow').new();
doc.set('data.friends', [ { type: 'duck', id: 'green' }, { type: 'duck', id: 'red' } ]);
doc.get('data.friends') // → [ DataObject, DataObject ]
```

## DataTimestamp

Wraps and unwraps Firebase Firestore Timestamp and Server Timestamp objects.

### isTimestamp `→ true`

Always returns `true`.

### isServerTimestamp `→ Boolean`

Returns true if this is a server timestamp

``` javascript
let doc = store.doc('duck/yellow').new();
doc.set('data.createdAt', store.serverTimestamp());
doc.get('data.createdAt.isServerTimestamp') // → true
```

``` javascript
let doc = store.doc('duck/yellow').new();
doc.set('data.createdAt', new Date());
doc.get('data.createdAt.isServerTimestamp') // → false
```

### date `→ Date`

Returns JavaScript Date representation of Firestore TimeStamp.

If it is Server Timestamp, returns null.

``` javascript
let doc = store.doc('duck/yellow').new();
doc.set('data.createdAt', new Date());
doc.get('data.createdAt.date') // → Date
```

### dateTime `→ Luxon.DateTime`

Returns Luxon DateTime representation of Firestore TimeStamp.

If it is Server Timestamp, returns null.

``` javascript
let doc = store.doc('duck/yellow').new();
doc.set('data.createdAt', new Date());
doc.get('data.createdAt.dateTime') // → Luxon.DateTime
```

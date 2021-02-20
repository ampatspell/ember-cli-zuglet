---
title: Store
pos: 1
---

# Store

``` javascript
import BaseStore from 'zuglet/store';

export default class Store extends BaseStore {

  options

}
```

Store has `@root` decorator applied which activates Store instances on first access.

## options `→ Object`

Override to provide Firebase SDK and `ember-cli-zuglet` configuration:

``` javascript
options = {

  // required
  firebase: {
    apiKey: '…',
    authDomain: '…',
    databaseURL: '…',
    projectId: '…',
    storageBucket: '…',
    messagingSenderId: '…',
    appId: '…'
  },

  firestore: {
    persistenceEnabled: true // defaults to `false`
  },

  auth: {
    user: 'user' // defaults to null
  },

  functions: {
    region: null // defaults to null
  },

  // defaults to no emulators configured
  emulators: {
    host: 'localhost',
    auth: 9099,
    firestore: 8080,
    functions: 5001
  }

}
```

## normalizedOptions `→ Object`

Normalized options with all defaults expanded

## identifier `→ String`

Unique `Store` identifier which can be used to distinguish multiple stores in runtime.

## models `→ Models`

Returns singleton [Models](api/models) instance.

## auth `→ Auth`

Returns singleton [Auth](api/auth) instance.

## storage `→ Storage`

Returns singleton [Storage](api/storage) instance.

## functions `→ Functions`

Returns singleton [Functions](api/functions) instance.

## doc(path) `→ DocumentReference`

Creates [document reference](api/firestore/reference/document) for given path.

``` javascript
let doc = store.doc('messages/first');
doc.id // → 'first'
doc.path  // → 'messages/first'
```

## collection(path) `→ CollectionReference`

Creates [collection reference](api/firestore/reference/collection) for given path.

``` javascript
let uid = 'zeeba';
let doc = store.collection(`users/${uid}/messages`);
doc.id // → 'messages'
doc.path  // → 'users/zeeba/messages'
```

## async transaction(callback) `→ Transaction`

Creates a [Firestore transaction](api/firestore/transaction).

``` javascript
await store.transaction(async tx => {
  let doc = await tx.load(store.doc('messages/first'));
  doc.data.value++;
  await tx.save(doc);
});
```

## async batch(callback) `→ any`

Creates a [Firestore batch](api/firestore/batch) which is commited immediately after async `callback` resolves.

``` javascript
await store.batch(async batch => {
  let ref = store.doc('messages/first');
  let doc = ref.new({ title: 'first' });
  batch.save(doc);
});
```

## batch() `→ Batch`

Creates a [Firestore batch](api/firestore/batch).

``` javascript
let batch = store.batch();

let ref = store.doc('messages/first');
let doc = ref.new({ title: 'first' });
batch.save(doc);

await batch.commit();
```

## serverTimestamp `→ firestore.FieldValue`

Returns `firestore.FieldValue.serverTimestamp()`

``` javascript
let doc = store.doc('messages/first').new({
  createdAt: store.serverTimestamp
});
await doc.save();
```

## blobFromUint8Array(array) `→ firestore.Blob`

Returns `firestore.Blob` created given from `Uint8Array`

``` javascript
let doc = store.doc('ducks/yellow').new({
  blob: store.blobFromUint8Array(new Uint8Array([ 1, 1, 1, 1, 0, 0, 1 ]))
});
await doc.save();
```

## onObserverError(model, error)

* model → `Document`, `Query`, `Auth`, `Task`
* error → `Error`

Override to log or handle errors for `onSnapshot` and passive loads for documents, queries, also Auth and storage Task observer errors.

``` javascript
import BaseStore from 'zuglet/store';

export default class Store extends BaseStore {

  options = options

  onObserverError(model, error) {
    console.error(model + '', error.stack);
  }

}
```

## projectId `→ String`

`options.firestore.projectId`

## dashboardURL `→ String`

Firestore dashboard URL.

## openDashboard()

`window.open` Firestore dashboard URL.

# Register & Initialize

``` javascript
import { register, initialize } from 'ember-cli-zuglet/initialize';
```

> TODO: content

# Stores

``` javascript
let stores = getOwner(this).lookup('zuglet:stores');
```

## ready `→ Promise`

A `Promise` which is resolved when all currently instantiated `Store` instances are ready to be used.

## createStore(identifier, factory) `→ Store`

Creates and registers a new `Store` instance.

* `identifier`: store identifier
* `factory`: `Store` subclass

``` javascript
// app/instance-initializers/zuglet-store.js

import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket
  },
  firestore: {
    persistenceEnabled: true
  }
};

const MainStore = Store.extend({

  options,

  restoreUser(user) {
  },

  restore() {
  }

});

export default {
  name: 'store',
  initialize(app) {
    let store = app.lookup('zuglet:stores').createStore('main', MainStore);
    app.register('service:store', store, { instantiate: false });
  }
}
```

> TODO: See Register & Initialize helpers for easier store setup.

## settle() `→ Promise`

Returns a promise which resolves when all currently running operations for all currently registered stores are finished.

> TODO: See `store.settle`

# Store

``` javascript
import Store from 'ember-cli-zuglet/store';
```

## identifier `→ String`

Unique `Store` identifier which can be used to distinguish multiple stores.

It is provided on `Store` creation and cannot be changed.

## ready `→ Promise<Store>`

A `Promise` which resolves when `Store` is ready to be used, meaning:

* Firestore is ready to be used (with or without local persistence)
* `restoreUser()` has resolved
* `Auth` user is restored
* `restore()` has resolved

## auth `→ Auth`

Returns a store `Auth` singleton instance.

## storage `→ Storage`

Returns a store `Storage` singleton instance.

## functions(region) `→ Functions`

Returns a store `Functions` singleton instance for a region.

* `region` → `string` or `null` (defaults to `us-central1`)

## observed `→ Array<Document|Query>`

Returns an observable `EmberArray` with `Document` and `Query` instances currently being observed (having `ref.onSnapshot` listeners).

Useful for debugging purposes to make sure app is not leaking observers.

> TODO: see `observed()`, `Observer`

## collection(name) `→ CollectionReference`

Creates a `CollectionReference` with given name or path.

* `name` → `String` name or path

``` javascript
store.collection('ducks');
store.collection('blog/ducks/posts');
```

## doc(path) `→ DocumentReference`

Creates a `DocumentReference` with given path.

* `path` → `String`

``` javascript
store.doc('blog/ducks');
store.doc('blog/ducks/posts/first');
```

## object(arg) `→ DataObject`

> TODO: Currently private

## array(arg) `→ DataArray`

> TODO: Currently private

## serverTimestamp() `→ DataTimestamp`

Creates a `DataTimestamp` instance configured as a server timestamp which will instruct Firestore to provide a timestamp value in the server side.

``` javascript
let doc = store.doc('ducks/yellow').new({
  createdAt: store.serverTimestamp()
});
```

## transaction(fn) `→ Promise<Store>`

Creates a transaction you can use to batch multiple reads and writes in a single atomic operation.

``` javascript
await store.transaction(async tx => {
  let doc = await tx.load(store.doc('books/yellow'));
  doc.incrementProperty('data.pages');
  tx.save(doc);
});
```

> TODO: see Transaction

## batch() `→ Batch`

Creates a `Batch` operation to perform multiple writes in one single atomic operation.

``` javascript
let batch = store.batch();
batch.save(duck);
batch.save(feathers);
await batch.commit();
```

## batch(callback) `→ Promise<Result>`

* `callback` → `Function`

Creates a `Batch` operation to perform multiple writes in one single atomic operation. It is commited when the `Promise` returned from `callback` resolves.

``` javascript
await store.batch(async batch => {
  batch.save(duck);
  batch.save(feathers);
});
```

## settle() `→ Promise`

Returns a promise which resolves when all currently running operations finishes.

Operations may include:

* Document read, write
* Query load
* Auth operations (like sign-in)
* Cloud Function calls
* Storage operations (upload tasks, metadata lodads)

``` javascript
let duck = store.doc('duck/yellow').new({ name: 'yellow' });
duck.save();
await store.settle();
// duck.isNew → false
```

## `abstact` restore() `→ Promise`

> TODO: restore. Check the flow

## `abstract` restoreUser(user) `→ Promise`

> TODO: restoreUser. Check the flow

# Auth

## methods `→ AuthMethods`
## user `→ AuthUser|null`
## signOut() `→ Promise`

# AuthMethods

## available `→ Array<String>`
## email `→ AuthEmailMethod`
## anonumous `→ AuthAnonymousMethod`

# AuthMethod

## type `→ string`

# AuthAnonymousMethod

## signIn() `→ Promise<User>`

# AuthEmailMethod

## signIn(email, password) `→ Promise<User>`
## signUp(email, password) `→ Promise<User>`

# AuthUser

## token(opts) `→ Promise<String|Object>`
## delete() `→ Promise`
## uid `→ String`
## isAnonymous `→ Boolean`
## displayName `→ String`
## email `→ String`
## emailVerified `→ Boolean`
## phoneNumber `→ String`
## photoURL `→ String`
## providerId `→ String`
## serialized `→ Object`

# Storage

## tasks `→ Array<StorageTask>`
## ref(opts) `→ StorageReference`

# StorageReference

## parent `→ StorageReference`
## ref(path) `→ StorageReference`
## fullPath `→ String`
## bucket `→ String`
## name `→ String`
## metadata `→ StorageReferenceMetadata`
## url `→ StorageReferenceURL`
## load(opts) `→ Promise<?>`
## delete(opts) `→ Promise`
## put(opts) `→ StorageTask`
## serialized `→ Object`

# StorageReferenceMetadata

## ref `→ StorageReference`
## isLoading `→ Boolean`
## isLoaded `→ Boolean`
## isError `→ Boolea`
## error `→ Object|null`
## exists `→ Boolean|undefined`
## load(opts) `→ Promise<This>`
## update(object) `→ Promise`
## raw `→ Object`
## type `→ raw alias`
## name `→ raw alias`
## size `→ raw alias`
## contentType `→ raw alias`
## customMetadata `→ raw alias`
## cacheControl `→ raw alias`
## contentDisposition `→ raw alias`
## contentEncoding `→ raw alias`
## contentLanguage `→ raw alias`
## bucket `→ raw alias`
## fullPath `→ raw alias`
## generation `→ raw alias`
## md5Hash `→ raw alias`
## metageneration `→ raw alias`
## createdAt `→ Date`
## updatedAt `→ Date`
## serialized `→ object`

# StorageReferenceURL

## ref `→ StorageReference`
## isLoading `→ Boolean`
## isLoaded `→ Boolean`
## isError `→ Boolea`
## error `→ Error|null`
## exists `→ Boolean|undefined`
## load(opts) `→ Promise<This>`
## value `→ String`
## serialized `→ Object`

# StorageTask

## ref `→ StorageReference`
## serialized `→ Object`
## promise `→ Promise`
## type `→ String`
## percent `→ Number`
## isRunning `→ Boolean`
## isCompleted `→ Boollean`
## isError `→ Boolean`
## error `→ Error`
## bytesTransferred `→ Number`
## totalBytes `→ Number`
## then(resolve, reject) `→ Promise`
## catch(fn) `→ Promise`
## finally(fn) `→ Promise`

# Functions

## region `→ String`
## callable(name) `→ FunctionsCallable`

# FunctionsCallable

## call(data) `→ Promise`

# FirestoreReference

## isReference `→ true`
## id `→ String`
## path `→ String`
## parent `→ DocumentReference|CollectionReference|QueryReference`
## isEqual(other) `→ Boolean`
## serialized `→ Array<Object>`
## string `→ String`

# DocumentReference extends FirestoreReference

## collection(name) `→ CollectionReference`
## doc(path) `→ DocumentReference`
## load(opts) `→ Promise<Document>`
## delete() `→ Promise<This>`
## new(object) `→ Document`
## existing() `→ Document`
## observe() `→ DocumentObserver`

# CollectionReference extends FirestoreReference, QueryableReferenceMixin

## doc(path) `→ DocumentReference`

# QueryableReferenceMixin

## where `→ QueryReference`
## orderBy `→ QueryReference`
## limit `→ QueryReference`
## startAt `→ QueryReference`
## startAfter `→ QueryReference`
## endAt `→ QueryReference`
## endBefore `→ QueryReference`
## query(opts) `→ Query`
## load(opts) `→ Promise<Array<Document>>`
## first(opts) `→ Promise<Document>`

# QueryReference extends QueryableReferenceMixin

## type `→ String`
## args `→ Array<Any>`
## parent `→ QueryReference|CollectionReference`
## serialized `→ Array<Object>`
## string `→ String`

# Document

## isNew
## isDirty
## isLoading
## isLoaded
## isSaving
## isObserving
## isError
## error
## exists
## metadata
## isDocument `→ true`
## ref `→ DocumentReference`
## id `→ String`
## path `→ String`
## data `→ DataObject`
## serialized `→ Object`
## load(opts) `→ Promise<This>`
## reload(opts) `→ Promise<This>`
## save(opts) `→ Promise<This>`
## delete() `→ Promise<This>`
## reset() `→ undefined`
## observe() `→ DocumentObserver`
## observers `→ Observers`

# Query

## isQuery `→ true`
## isLoading `→ Boolean`
## isLoaded `→ Boolean`
## isObserving `→ Boolean`
## isError `→ Boolean`
## error `→ Error|Null`
## type `→ String (array|first)`
## size `→ Number|undefined`
## empty `→ Boolean|undefined`
## metadata `→ Object|undefined`
## ref `→ CollectionReference|QueryReference`
## isArray `→ Boolean`
## isFirst `→ Boolean`
## serialized `→ Object`
## load(opts) `→ Promise<This>`
## observe() `→ QueryObserver`
## observers `→ Observers`

# ArrayQuery

## content `→ Array<Document>`

# FirstQuery

## content `→ Document|null`

# Observers extends Array

## promise `→ Promise`

# Observer

## isCancelled `→ Boolean`
## promise `→ Promise`
## load() `→ Promise`
## cancel() `→ undefined`

# DocumentObserver extends Observer

## doc `→ Document`

# QueryObserver extends Observer

## query `→ Query`

# DataObject

## serialized `→ Object`
## serialize(type) `→ Object`

# DataArray extends Array

Wraps primitive types in Ember-observable ones and manages dirty tracking

# DataTimestamp

## isTimestamp `→ true`
## isServerTimestamp `→ Boolean`
## date `→ Date`
## dateTime `→ Luxon.DateTime`

# Batch

## save(doc, opts) `→ Doc`
## delete(docOrRef) `→ Document|DocumentReference`
## commit() `→ Promise`

# Transaction

## load(docOrRef, opts) `→ Promise<Document>`
## save(doc, opts) `→ undefined`
## delete(doc) `→ undefined`

# Less-Experimental

## Observed

### observed()
### owner(...args)
### content(arg)

## Route

### route()
### inline(...args)
### named(arg)
### mapping(arg)

## Model

### model()
### owner(...args)
### inline(...args)
### named(arg)
### mapping(arg)

## Models

### models(arg)
### source(arg)
### owner(...args)
### object(...args)
### inline(...args)
### named(arg)
### mapping(arg)

# Util

## random-string

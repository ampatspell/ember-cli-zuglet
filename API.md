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

``` javascript
await store.ready;
```

``` javascript
// app/routes/application.js
import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    return this.store.ready;
  }
});
```

## createStore(identifier, factory) `→ Store`

Creates and registers a new `Store` instance.

* `identifier`: store identifier
* `factory`: `Store` subclass

``` javascript
// app/instance-initializers/zuglet-store.js
import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    // apiKey: '',
    // authDomain: '',
    // databaseURL: '',
    // projectId: '',
    // storageBucket: '',
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

> TODO: see `Stores`

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

It is responsible for user management. Sign-up, sign-in and getting current user.

## storage `→ Storage`

Returns a store `Storage` singleton instance.

It lets you upload files, lookup and modify file metadata, get file public URLs.

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

``` javascript
let auth = store.auth;
```

## methods `→ AuthMethods`

``` javascript
let methods = store.auth.methods;
methods.anonymous // → AuthAnonymousMethod
```

## user `→ AuthUser | null`

Returns currently logged-in `AuthUser` instance or null of user is not logged in.

## signOut() `→ Promise`

Signs out currently logged in user.

``` javascript
await store.auth.signOut();
store.auth.user // → null
```

# AuthMethods

Lists and gives access to all available auth methods.

> Note: Currently only Email and Anonumous auth methods are implemented in ember-cli-zuglet

## available `→ Array<String>`

Returns an array of auth method names.

``` javascript
let names = store.auth.methods.available;
let methods = names.map(name => store.auth.methods[name]);
```

## email `→ AuthEmailMethod`

Sign-up and sign-in with email and password.

> TODO: See AuthEmailMethod

## anonumous `→ AuthAnonymousMethod`

Sign-in anonymously.

> TODO: See AuthAnonymousMethod

# AuthMethod

## type `→ string`

Returns a type of auth method.

``` javascript
store.auth.methods.anonymous.type // → 'anonymous'
```

# AuthAnonymousMethod

Anonymous auth method lets you sign-in users without any personal details.

Later on it's possible to link anonymous account with any other means of authentication.

## signIn() `→ Promise<AuthUser>`

Returns a `Promise` which resolves with signed-in anonymous `AuthUser`.

At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.anonymous.signIn();
store.auth.user === user // → true
```

# AuthEmailMethod

Email method lets you sign-up and later sign-in users with email address and the password.

## signUp(email, password) `→ Promise<AuthUser>`

Signs-up the user with email and password.

Returns a `Promise` which resolves with newly created `AuthUser` instance. At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.email.signUp('zeeba@gmail.com', 'hello-world');
store.auth.user === user // → true
```

## signIn(email, password) `→ Promise<AuthUser>`

Signs-in existing user with email and password.

Returns a `Promise` which resolves with signed-in `AuthUser` instance. At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.email.signIn('zeeba@gmail.com', 'hello-world');
store.auth.user === user // → true
```

# AuthUser

`AuthUser` represents currently signed-in user.

## token({ type, refresh }) `→ Promise<String|Object>`

Returns a `Promise` which is resolved with either encoded or decoded user token.

Decoded user token might be useful to get custom user claims.

* `type` → `String`: `string` or `json` (defaults to `string`)
* `refresh` → Boolean (defaults to `false`)

## delete() `→ Promise`

Returns a `Promise` which is resolved when user is deleted.

## uid `→ String`

Returns user id

## isAnonymous `→ Boolean`

Returns true if anonymous auth method was used to sign-in.

## displayName `→ String`

Returns user's display name if available.

## email `→ String`

Returns user's email if available.

## emailVerified `→ Boolean`

Returns whether user has verified email.

## phoneNumber `→ String`

Returns user's phone number if available.

## photoURL `→ String`

Returns user's photoURL if available.

## providerId `→ String`

Returns authentication provider id.

If anonymous or email auth methods are used, this is `firebase`.

## serialized `→ Object`

Returns json representation of most important user's properties.

Useful for debugging.

``` javascript
console.log(store.auth.user.serialized);
// {
//   uid: '....',
//   isAnonymous: true,
//   displayName: null,
//   email: null,
//   emailVerified: false,
//   phoneNumber: null,
//   photoURL: null,
//   providerId: 'firebase'
// }
```

# Storage

`Storage` lets you upload files, load and update file metadata and get file public URLs.

``` javascript
let storage = store.storage;
```

## tasks `→ Array<StorageTask>`

Returns an observable array of currently running file upload `StorageTask` instances.

## ref(arg) `→ StorageReference`

Creates a `StorageReference` you can use to upload a file and/or get file metadata or public URL.

* `arg` → `String` or `Object`

If argument is `String`, it is converted to `{ path: arg }`.

Either `path` or `url` is required.

``` javascript
storage.ref('pictures/duck');
storage.ref({ path: 'pictures/duck' })
storage.ref({ url: 'gs://foo/bar' })
```

# StorageReference

Storage reference represents a file location with stateful metadata and url.

## parent `→ StorageReference`

Creates and returns a new storage reference for parent.

``` javascript
let ref = storage.ref('pictures/duck')
ref.parent; // → StorageReference for 'pictures'
ref.parent.parent // → null
```

## ref(path) `→ StorageReference`

Creates and returns a new storage reference for a child file location.

``` javascript
let ref = storage.ref('pictures');
ref.ref('duck') // → StorageReference for 'pictures/duck'
ref.ref('duck/profile-picture') // → StorageReference for 'pictures/duck/profile-picture'
```

## fullPath `→ String`

Returns a full file location path

``` javascript
let ref = storage.ref('pictures/duck');
ref.fullPath // → 'pictures/duck'
```

## bucket `→ String`

Returns a name of the bucket where file is stored.

``` javascript
let ref = storage.ref('pictures/duck');
ref.bucket // → '<app-id>.appspot.com'
```

## name `→ String`

Returns a filename

## metadata `→ StorageReferenceMetadata`

Returns a `StorageReferenceMetadata` instance for this reference.

> TODO: See StorageReferenceMetadata

## url `→ StorageReferenceURL`

Returns a `StorageReferenceURL` instance for this reference.

> TODO: See StorageReferenceURL

## load({ url, metadata, optional }) `→ Promise<StorageReference>`

Loads reference metadata and/or url.

* `url` → Boolean (defaults to `false`)
* `metadata` → Boolean (defaults to `false`)
* `optional` → Boolean (defaults to `false`)

If both `url` and `metadata` are `false`, both are set to true.

``` javascript
let ref = storage.ref('duck/yellow');
await ref.load(); // → StorageReference with metadata and url loaded
```

If file does not exist and `optional` is `false`, load `Promise` rejects with `storage/object-not-found` error.

## delete({ optional }) `→ Promise<StorageReference>`

Deletes a file.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, delete `Promise` rejects.

## put({ type, data, format, metadata }) `→ StorageTask`

Creates and returns a `StorageTask` and starts uploading a `Blob`, `File` or `String`.

* `type` → 'file' or 'string'
* `data` → `File`, `Blob` or `String`
* `format` → String (only for `{ type: 'string' }`)
* `metadata` → Object

String formats:

* `raw`
* `base64`
* `base64-url`
* `data-url`

``` javascript
let task = storage.ref('hello').put({
  type: 'string',
  data: 'This is content',
  format: 'raw',
  metadata: {
    contentType: 'text/plain',
    customMetadata: {
      ok: true
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: new Blob([ 'This is content' ]),
  metadata: {
    contentType: 'text/plain',
    customMetadata: {
      ok: true
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type,
    customMetadata: {
      originalFilename: file.name
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'string',
  data: 'This is content',
  format: 'raw'
});

task.isRunning // → true

await task;

task.isRunning // → false
task.isCompleted // → true
```

## serialized `→ Object`

Returns json representation of most important `StorageReference` properties.

Useful for debugging.

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

## content `→ Document | Query`
## isCancelled `→ Boolean`
## promise `→ Promise`
## load() `→ Promise`
## cancel() `→ undefined`

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

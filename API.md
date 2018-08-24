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

Returns a `Promise` which resolves when all currently running operations for all currently registered stores are finished.

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

* `type` → `String`: `string` or `json` (defaults to `string`)
* `refresh` → Boolean (defaults to `false`)

Decoded user token might be useful to get custom user claims.

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
//   uid: '…',
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

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

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

Represents a stateful metadata information about single file.

``` javascript
let metadata = storage.ref('hello').metadata;
```

## ref `→ StorageReference`

Returns a storage reference associated with this metadata instance.

## load({ optional }) `→ Promise<StorageReference>`

Loads metadata for associated storage reference.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

``` javascript
let metadata = storage.ref('hello').metadata;

metadata.isLoaded // → false

await metadata.load();

metadata.isLoaded // → true
metadata.exists // → true
```

## update(object) `→ Promise<StorageReference>`

Updates file metadata.

``` javascript
let metadata = storage.ref('hello').metadata;
await metadata.update({
  contentType: 'text/plain',
  customMetadata: {
    hello: 'world'
  }
});
```

## State properties

* `isLoading` → `Boolean`
* `isLoaded` → `Boolean`
* `isError` → `Boolea`
* `error` → `Object | null`
* `exists` → `Boolean | undefined`

## Metadata properties

* `raw → `Object`
* `type → `String`
* `name → `String`
* `size → `Number`
* `contentType` → `String`
* `customMetadata` → `Object`
* `cacheControl` → `String`
* `contentDisposition` → `String`
* `contentEncoding` → `String`
* `contentLanguage` → `String`
* `bucket` → `String`
* `fullPath` → `String`
* `md5Hash` → `String`
* `generation` → `String`
* `metageneration` → `String`
* `createdAt` → `Date`
* `updatedAt` → `Date`

## serialized `→ object`

Returns json representation of most important `StorageReferenceMetadata` properties.

Useful for debugging.

# StorageReferenceURL

Represents a stateful public url for a single file.

``` javascript
let url = storage.ref('hello').url;
await url.load();
url.value // → https://…
```

## ref `→ StorageReference`

Returns a storage reference associated with this metadata instance.

## State properties

* `isLoading` → `Boolean`
* `isLoaded` → `Boolean`
* `isError` → `Boolea`
* `error` → `Object | null`
* `exists` → `Boolean | undefined`

## load(opts) `→ Promise<StorageReferenceURL>`

Loads public URL for associated storage reference.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

## value `→ String`

Public URL for associated storage reference.

## serialized `→ object`

Returns json representation of most important `StorageReferenceMetadata` properties.

# StorageTask

Storage task represents a single file upload.

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type
  }
});
await task;
task.isCompleted // → true
```

Task is promise-like but also exposes `promise` property. There is no difference which is awaited for.

Promise methods:

* `then(resolve, reject)`
* `catch(err)`
* `finally(fn)`

## type `→ String`

Returns upload file type: `string` or `data`.

## ref `→ StorageReference`

Returns a storage reference associated with this task.

## State properties

* `isRunning` → `Boolean`
* `isCompleted` → `Boollean`
* `isError` → `Boolean`
* `error` → `Error`
* `bytesTransferred` → `Number`
* `totalBytes` → `Number`
* `percent` → `Number`

## promise `→ Promise`

Returns a promise which resolves when file is finished uploading.

## serialized `→ Object`

Returns json representation of most important storage task properties.

Useful for debugging.

# Functions

Represents a Firebase Cloud functions region.

``` javascript
let functions = store.function();
await functions.callable('hello-world').call({ });
```

## region `→ String | null`

Returns a name of the region

## callable(name) `→ FunctionsCallable`

Creates a callable instance for the name.

# FunctionsCallable

Represents a single callable (`functions.https.onCall`) Firebase Cloud Function.

``` javascript
// firebase/functions/index.js
const functions = require('firebase-functions');
const HttpsError = functions.https.HttpsError;

exports.hello = functions.https.onCall(async (data, context) => {
  let { name } = data;

  if(!name) {
    throw new HttpsError('failed-precondition', 'name is required');
  }

  return {
    message: `Hello ${name}`
  };
});
```

## name `→ String`

Function name

## functions `→ Functions`

Functions instance (region) associated with this callable function.

## call(opts) `→ Promise<Object>`

Calls a Cloud Firestore callable function with `opts`.

Returns a `Promise` which resolves with the function response or rejects with an error.

``` javascript
let callable = functions.callable('hello');
let data = await callable.call({ name: 'duck' });
// →
// {
//   result: {
//     message: 'Hello duck'
//   }
// }
```

# FirestoreReference

## isReference `→ true`

Always `true` for all Firestore references.

## id `→ String`

`id` of the document or collection.

``` javascript
let ref = store.doc('ducks/yellow');
ref.id // → 'yellow'
```

``` javascript
let ref = store.collection('ducks/yellow/feathers');
ref.id // → 'feathers'
```

## path `→ String`

Full document or collection `path`

``` javascript
let ref = store.doc('ducks/yellow');
ref.path // → 'ducks/yellow'
```

## parent `→ DocumentReference|CollectionReference|QueryReference`

Returns parent Document, Collection, Query reference or null.

``` javascript
let ref = store.doc('ducks/yellow');
ref.parent // → collection reference for 'ducks'
```

## isEqual(other) `→ Boolean`

Returns true if references are pointing to the same document or collection.

## serialized `→ Array<Object>`

Returns json representation of reference components.

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.serialized
// →
// [
//   { type: 'collection', id: 'ducks' },
//   { type: 'document', id: 'yellow' },
//   { type: 'collection', id: 'feathers' },
//   { type: 'query', id: 'where', args: [ 'color' , '==', 'white' ] }
// ]
```

## string `→ String`

Returns human readable string representation of reference components

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.string
// → ducks/yellow/feathers.where(color, ==, white)
```

# DocumentReference extends FirestoreReference

## collection(path) `→ CollectionReference`

Creates and returns a nested collection reference.

``` javascript
let ref = store.doc('ducks/yellow');
ref.collection('feathers'); // → collection reference for 'ducks/yellow/feathers'
```

``` javascript
let ref = store.doc('ducks/yellow');
ref.collection('orders/oaisud/products'); // → collection reference for 'ducks/yellow/orders/oaisud/products'
```

## doc(path) `→ DocumentReference`

Creates and returns nested document reference.

If `path` contains even number of components, document id is generated.

``` javascript
let ref = store.doc('ducks/yellow');
ref.doc('feathers/white'); // → collection reference for 'ducks/yellow/feathers/white'
```

``` javascript
let ref = store.doc('ducks/yellow');
ref.doc('feathers'); // → collection reference for 'ducks/yellow/feathers/Xtg4HEQ1KNfOHrHmfRPL'
```

## load({ source, optional }) `→ Promise<Document>`

Returns a `Promise` which resolves with a loaded `Document`.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)
* `optional` → `Boolean` (defaults to `false`)

If `optional` is `true` and document does not exist, Document with `{ exists: false }` is returned.

If `source` is `cache`, cached document is returned, if document is not in the cache, up-to-date document is returned from the server.

``` javascript
let ref = store.doc('ducks/yellow');
let doc = await ref.load({ source: 'cache', optional: true });
doc.exists // → true
doc.isLoaded // → true
doc.data // → document contents
```

## delete() `→ Promise<DocumentReference>`

Deletes a document.

``` javascript
let ref = store.doc('ducks/yellow');
await ref.delete();
```

## new(object) `→ Document`

Creates a new `Document` instance which is not yet saved in the Firestore.

* `object` → Object: document data properties

`Document` initially has `{ isNew: false }`.

``` javascript
let ref = store.doc('ducks/yellow');
let doc = ref.new({ name: 'Yellow Duck' });
doc.isNew // → true
doc.isDirty // → false
doc.isLoaded // → false
doc.data.serialized // → { name: 'Yellow Duck' }
await doc.save();
```

## existing() `→ Document`

Creates a `Document` instance which is expected to exist.

`Document` initially has `{ isNew: false }`.

``` javascript
let ref = store.doc('ducks/yellow');
let doc = ref.existing();
doc.isNew // → false
doc.isDirty // → false
doc.isLoaded // → false
await doc.load();
```

## observe() `→ DocumentObserver`

Creates an `existing` `Document` and starts observing it for document changes.

``` javascript
let ref = store.doc('ducks/yellow');
let observer = ref.observe();
observer.content // → Document instance
observer.cancel(); // stop observing this Document
```

This method is a shorthand for:

``` javascript
let ref = store.doc('ducks/yellow');
let doc = ref.existing();
let observer = doc.observe();
observer.content === doc // → true
```

> TODO: See Document.observe

# CollectionReference extends FirestoreReference, QueryableReferenceMixin

## doc(path) `→ DocumentReference`

Creates a nested document reference.

``` javascript
let coll = store.collection('ducks');
let ref = coll.doc('yellow'); // → document reference for 'ducks/yellow'
```

``` javascript
let coll = store.collection('ducks');
let ref = coll.doc('yellow/orders/first'); // → document reference for 'ducks/yellow/orders/first'
```

# QueryableReferenceMixin

## Query components

* `where`
* `orderBy`
* `limit`
* `startAt`
* `startAfter`
* `endAt`
* `endBefore`

``` javascript
let ref = store
  .collection('ducks')
  .where('name', '==', 'yellow')
  .orderBy('name', 'asc')
  .limit(100);
// → Queryable reference for `ducks` with `where`, `orderBy` and 'limit' clauses
```

## query({ type }) `→ Query`

Creates a new stateful Query which is not loaded automatically.

* `type` → 'first' 'array' (defaults to 'array')

If `type` is `first` query sets `limit` to 1.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.content // → [ Document, … ]
```

``` javascript
let query = store.collection('ducks').orderBy('createdAt', 'desc').query({ type: 'first' });
await query.load();
query.content // → Document
```

First document query is useful for querying and observing one single document.

> TODO: See Query

## load({ source }) `→ Promise<Array<Document>>`

Returns a `Promise` which resolves with an array of `Document` instances.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)

If `source` is `cache`, cached documents are returned, if query results are not cached yet, documents are fetched from the server.

``` javascript
let ref = store.collection('ducks');
let array = await ref.load({ source: 'cache' });
// → [ Document, … ]
```

## first({ source, optional }) `→ Promise<Document>`

Fetches a first Document in collection or based on a query.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)
* `optional` → Boolean (defaults to `false`)

If `source` is `cache`, cached documents are returned, if query results are not cached yet, documents are fetched from the server.

If query returns an empty array and `optional` is `false`, load `Promise` rejects with a document not found errror.

Returns a `Promise` which resolves with a `Document` instance.

``` javascript
let ref = store.collection('ducks').orderBy('name', 'asc');
let doc = await ref.first({ source: 'cache', optional: true });
// → Document
```

# QueryReference extends QueryableReferenceMixin

## type `→ String`

Condition `type`.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.type // → 'where'
```

## args `→ Array<Any>`

Condition arguments.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.args // → [ 'name', '==', 'yellow' ]
```

## parent `→ QueryReference|CollectionReference`

Returns a parent reference.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.parent // → collection reference for 'ducks'
```

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow').limit(100);
ref.parent // → queryable reference for collection 'ducks' with where condition
```

## serialized `→ Array<Object>`

Returns json representation of reference components.

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.serialized
// →
// [
//   { type: 'collection', id: 'ducks' },
//   { type: 'document', id: 'yellow' },
//   { type: 'collection', id: 'feathers' },
//   { type: 'query', id: 'where', args: [ 'color' , '==', 'white' ] }
// ]
```

## string `→ String`

Returns human readable string representation of reference components

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.string
// → ducks/yellow/feathers.where(color, ==, white)
```

# Document

`Document` instance represents a single Firestore document.

You can have multiple Document instances which points to the same Firestore document path.

## isDocument `→ true`

Always returns `true` for `Document` instances

## ref `→ DocumentReference`

Returns a document reference associated with this `Document`.

> TODO: See document reference

## id `→ String`

Returns a document id.

Alias for `ref.id`

## path `→ String`

Returns document full path.

Alias for `ref.path`

## State properties

* `isNew`
* `isDirty`
* `isLoading`
* `isLoaded`
* `isSaving`
* `isError`
* `error`
* `exists` → `Boolean` or `undefined` if not yet loaded
* `isObserving` → `Boolean`: true if Document is being observed

## metadata `→ Object`

Returns Firestore snapshot metadata.

``` javascript
let doc = await store.doc('ducks/yellow').load();
doc.metadata
// →
// {
//   fromCache: false,
//   hasPendingWrites: false
// }
```

## data `→ DataObject`

Contains actual Firestore document properties wrapped in mutable and observable `EmberObject` and `EmberArray` instances.

Attempts are being made to minimize unnecessary property change notifications as much as possible.

> **Note:** As of right now it is required to use `Ember.get` to access property values.

``` javascript
let doc = await store.doc('ducks/yellow').load();
doc.data.get('name') // → Yellow Duck
doc.data.set('name', 'Yellow Ducky')
doc.data.set('address', { street: 'Duck Street' });
```

## reset() `→ undefined`

Rollbacks Document data to previous known pristine (server or cached) state so that Document becomes `{ isDirty: false }` again.

``` javascript
let doc = await store.doc('ducks/yellow').load();
doc.isDirty // → false

doc.set('data.name', 'Yellow Ducky');
doc.isDirty // → true

doc.reset();
doc.isDirty // → false
doc.get('data.name') // Yellow Duck
```

## load({ source, force }) `→ Promise<Document>`

Loads or reloads a document from server or cache.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)
* `force` → `Boolean`: (defaults to `false`)

If `source` is `cache`, cached document is returned, if document is not in the cache, up-to-date document is returned from the server.

If `force` is `false` and document is already loaded, document is not reloaded. On the other hand, if `force` is `true`, document is always reloaded.

``` javascript
let doc = await store.doc('duck/yellow').load({ source: 'cache' }); // → loads document
await doc.load(); // → does nothing
```

``` javascript
let doc = await store.doc('duck/yellow').load(); // → loads document
await doc.load({ force: true }); // → reloads document
```

## reload(opts) `→ Promise<Document>`

Loads or reloads a document from server or cache.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)

If `source` is `cache`, cached document is returned, if document is not in the cache, up-to-date document is returned from the server.

``` javascript
let doc = await store.doc('duck/yellow').load(); // → loads document
await doc.reload(); // → reloads document
```

Same as `load({ force: true })`.

## save({ type, merge }) `→ Promise<Document>`

Saves document in Firestore database.

* `type` → `set` or `update` (defaults to `set`)
* `merge` → `Boolean` (defaults to `false`), used only if `type` is `set`

If no options are provided, defaults (`{ type: 'set', merge: false }`) always overwrites the whole document. To change this behavior, use `{ merge: true }` to do a server-side merge of existing document properties with added ones.

**Save document by overwriting all the properties:**

``` javascript
let doc = await store.doc('duck/yellow').load();
doc.set('data.address', { street: 'Duck Street' });
await doc.save();
// → This save will overwrite whole document with loaded properties and added/overwritten street property
```

**Save document by merging in some added properties:**

``` javascript
let doc = store.doc('duck/yellow').new();
doc.set('data.address', { street: 'Duck Street' });
await doc.save({ type: 'set', merge: true });
// → This save will add `street` property to the document
```

> **Note:** At the moment `{ merge: true }` does not remove properties from the document, only adds or updates existing ones (You can use use `null` value as a workaround).

**Update document expecting it to exist in database:**

``` javascript
let doc = await store.doc('duck/yellow').load();
await doc.save({ type: 'update' });
// → This save will throw if document was deleted in between load and save
```

## delete() `→ Promise<Document>`

Deletes a document from Firebase database.

``` javascript
let doc = await store.doc('ducks/yellow').load();
await doc.delete();
```

## observe() `→ Observer`

Creates a new document observer and immediately starts observing document for changes.

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();

await observer.load();

doc.isLoaded // → true
observer.cancel();
```

While there may be multiple Observer instances for each document, Document always has up to one actual `ref.onSnapshot` observer.

**Note:** Make sure you cancel all unnecessary observers.

> TODO: See `observed()`

## observers `→ Observers`

Returns array of Observers currently observing this document.

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();

let observers = doc.observers; // → [ observer ]
await observers.promise;

doc.isLoaded // → true
observer.cancel();
```

## serialized `→ Object`

Returns json representation of document state as well as preview of data

Useful for debugging.

``` javascript
let doc = await store.doc('ducks/yellow').load();
doc.serialized
// →
// {
//   id: 'yellow',
//   path: 'ducks/yellow',
//   isNew: false,
//   isDirty: false,
//   isLoading: false,
//   isLoaded: true,
//   isSaving: false,
//   isObserving: false,
//   isError: false,
//   error: null,
//   exists: true,
//   metadata: {
//     fromCache: false,
//     hasPendingWrites: false
//   },
//   data: {
//     name: "Yellow Duck",
//     address: {
//       street: 'Durchführen Straße'
//     }
//   }
// }
```

**You can also use `doc.data.serialized`:**

``` javascript
let doc = await store.doc('ducks/yellow').load();
doc.data.serialized
// →
// {
//   name: "Yellow Duck",
//   address: {
//     street: 'Durchführen Straße'
//   }
// }
```

# Query

## isQuery `→ true`

Always returns `true` for Query instances.

## ref `→ CollectionReference|QueryReference`

Returns collection or query reference associated with this query.

## type `→ String`

Type of this query, either `array` or `first`.

## isArray `→ Boolean`

Alias for `type === 'array'`

## isFirst `→ Boolean`

Alias for `type === 'first'`

## Query state

* `isLoading`
* `isLoaded`
* `isObserving`
* `isError`
* `error`

## size `→ Number|undefined`

Returns number of documents fetched by this query.

## empty `→ Boolean|undefined`

`True` if query yielded zero results.

## metadata `→ Object|undefined`

Query metadata.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.metadata
// →
// {
//   fromCache: false,
//   hasPendingWrites: false
// }
```

## content `→ Array<Document>|Docuemnt`

Query result or results, depending on the `type`:

* `array` → array of `Document` instances
* `first` → `Document` or null

## load({ source, force }) `→ Promise<Query>`

Loads a query.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)
* `force` → `Boolean`: (defaults to `false`)

If `source` is `cache`, cached documents are returned, if query is not in the cache, up-to-date response is returned from the server.

If `force` is `false` and query is already loaded, it is not reloaded. On the other hand, if `force` is `true`, query is always reloaded.

``` javascript
let query = store.collection('ducks').query();
await query.load(); // → loads
await query.load({ force: true }); // → reloads
query.content // → [ Document, … ]
```

## observe() `→ Observer`

Creates a new query observer and immediately starts observing query for changes which includes added, removed and updated documents.

``` javascript
let query = store.collection('ducks').query();
let observer = query.observe();

await observer.load();

query.isLoaded // → true
observer.cancel();
```

While there may be multiple Observer instances for each query, Query always has up to one actual `ref.onSnapshot` observer.

It is more efficient to observe query instead of observing each separate document.

**Note:** Make sure you cancel all unnecessary observers.

> TODO: See `observed()`

## observers `→ Observers`

Returns array of Observers currently observing this query.

``` javascript
let query = store.collection('ducks').query();
let observer = query.observe();

let observers = query.observers; // → [ observer ]
await observers.promise;

query.isLoaded // → true
observer.cancel();
```

## serialized `→ Object`

Returns json representation of query most important properties.

Useful for debugging.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.serialized
// →
// {
//   isLoading: false,
//   isLoaded: true,
//   isObserving: false,
//   isError: false,
//   error: null,
//   type: 'array',
//   size: 42,
//   empty: false,
//   metadata: {
//     fromCache: false,
//     hasPendingWrites: false
//   }
// }
```

# Observer

Observer wraps an observation subject (document or query), means of getting initial (cached) content and cancellation.

**Note:** Make sure you cancel all observers when they are not needed anymore.

## isCancelled `→ Boolean`

Returns `true` if this observer is cancelled. It doesn't mean that the subject is not being observed by other observer(s).

## content `→ Document | Query`

Observation subject.

## promise `→ Promise`

Returns a `Promise` which resolves on **first** `onSnapshot` invocation. Which means it may resolve with cached data if possible.

For UI performance reasons it is best practice to observe documents and queries and present them when this promise resolves.

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();
await observer.promise;
doc.isLoaded // → true
doc.metadata // → { fromCache: true, … }
```

> TODO: see observed()

## load() `→ Promise`

Function alias for `promise` property.

## cancel() `→ undefined`

Cancels this observer.

# Observers `extends Array`

An array of currently running observers for a Docuemnt or Query

``` javascript
let doc = store.doc('ducks/yellow').existing();
doc.observers // → [ ]

let observer = doc.observe();
doc.observers // → [ observer ]

observer.cancel();
doc.observers // → [ ]
```

## promise `→ Promise`

Returns a `Promise` which, depending on whether current number of observers are:

* zero → does nothing, resolves immediately
* one or more → resolves on first Document or Query snapshot (cached)

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();

await doc.observers.promise;

doc.isLoaded // → true
doc.metadata // → { fromCache: true, … }

observer.cancel();
```

> TODO: See observed()

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

# Batch

Batch operation performs multiple writes in a single atomic operation.

``` javascript
let batch = store.batch();
batch.save(duck);
batch.save(feathers);
await batch.commit();
```

``` javascript
await store.batch(async batch => {
  batch.save(duck);
  batch.save(feathers);
});
```

> TODO: See store.batch

## save(doc, { type, merge }) `→ Document`

Enqueues document save which is performed when batch is commited.

* `doc` → `Document`
* `type` → `set` or `update` (defaults to `set`)
* `merge` → `Boolean` (defaults to `false`), used only if `type` is `set`

> TODO: see doc.save for options

## delete(arg) `→ Document|DocumentReference`

* `arg` → `Document` or `DocumentReference`

Enqueues document delete by providing a document or document reference.

``` javascript
let doc = store.doc('ducks/yellow');
await store.batch(async batch => {
  batch.delete(doc);
});
```

``` javascript
let doc = store.doc('ducks/yellow').existing();
await store.batch(async batch => {
  batch.delete(doc);
});
```

## commit() `→ Promise`

Commits a batch. Useful only if batch is created without callback.

``` javascript
let doc = store.doc('ducks/yellow').existing();
let batch = store.batch();
batch.delete(doc);
await batch.commit();
```

# Transaction

Transaction performs multiple reads and writes in a single atomic operation.

``` javascript
await store.transaction(async tx => {
  let doc = await tx.load(store.doc('books/yellow'));
  doc.incrementProperty('data.pages');
  tx.save(doc);
});
```

> TODO: See store.transaction

## load(arg, opts) `→ Promise<Document>`

Loads a document or document reference.

* `arg` → `Docuemnt` or `DocumentReference`

``` javascript
await store.transaction(async tx => {
  let ref = store.doc('books/yellow');
  let doc = await tx.load(ref);
});
```

``` javascript
await store.transaction(async tx => {
  let doc = store.doc('books/yellow').existing();
  await tx.load(doc); // → result === doc
});
```

> TODO: see doc.load and ref.load

## save(doc, opts) `→ undefined`

Enqueues a document save which is performed when transaction commits.

* `doc` → `Docuemnt`
* `opts` → `Object`

``` javascript
await store.transaction(async tx => {
  let doc = await tx.load(store.doc('books/yellow'));
  doc.incrementProperty('data.pages');
  tx.save(doc);
});
```

> TODO: see doc.save

## delete(arg) `→ undefined`

Enqueues a document delete which is performed when transaction commits.

* `arg` → `Document` or `DocumentReference`

``` javascript
await store.transaction(async tx => {
  let doc = await tx.load(store.doc('books/yellow'));
  tx.delete(doc);
});
```

# Models

Standalone helpers for creating `model:${name}` instances.

``` javascript
let models = store.models;
```

## registerFactory(name, factory) `→ undefined`

Registers a `factory` as `model:${name}` in Ember container.

* `name` → `String`
* `factory` → `EmberObject class`

``` javascript
models.registerFactory('duck', EmberObject.extend({ ... }));
let model = models.create('duck', { name: 'yellow' });
// →
```

## hasFactoryFor(name) `→ Boolean`
## factoryFor(name, { optional }) `→ Factory`
## create(name, props) `→ Instance`

# Less-Experimental

## Observed

* also `resolveObservers`

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

---
pos: 1
---

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

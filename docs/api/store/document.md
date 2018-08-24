---
pos: 1
---

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

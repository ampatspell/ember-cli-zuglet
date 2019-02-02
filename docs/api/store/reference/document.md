---
title: Document
pos: 0
---

# Document Reference `extends Reference`

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

``` javascript
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

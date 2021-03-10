---
title: Document
pos: 1
---

# Document Reference `extends Reference`

``` javascript
let ref = store.doc('messages/first');
```

## id `→ string`

Document id

## path `→ string`

Document path

## parent `→ CollectionReference`

Creates a new [Collection Reference](api/firestore/reference/collection) which points to document's parent

``` javascript
let ref = store.doc('messages/first');
let coll = ref.parent;
coll.path // → 'messages'
```

## collection(path) `→ CollectionReference`

Creates a new [Collection Reference](api/firestore/reference/collection) which points to nested collection

``` javascript
let ref = store.doc('users/zeeba');
let coll = ref.collection('messages');
coll.path // → users/zeeba/messages
```

## new(data) `→ Document`

Create a new [Document](api/firestore/document) instance with `isNew` set to `true`.

``` javascript
let ref = store.doc('messages/first');

let doc = ref.new({
  message: 'hey there'
});

doc.ref // → ref
doc.isNew // → true
doc.isLoaded // → false
doc.data.message // → 'hey there'
```

## existing() `→ Document`

Create a new [Document](api/firestore/document) instance with `isNew` set to `false`.

``` javascript
let ref = store.doc('messages/first');

let doc = ref.existing();

doc.ref // → ref
doc.isNew // → false
doc.isLoaded // → false
```

## async load({ optional }) `→ Document`

* `optional` → boolean, defaults to false:

Loads and returns [Document](api/firestore/document) instance for loaded Firestore document.

If document does not exist and `optional` is:

* `false`: `Error` with code `zuglet/document/missing` is thrown
* `true`: `undefined` is returned

``` javascript
let doc = await store.doc('messages/first').load();
doc.isLoaded // → true
doc.data.message // → 'hey there'
```

## async delete()

Deletes Firestore document.

``` javascript
await store.doc('messages/first').delete();
```

## async data() `→ object or undefined`

Loads Firestore document data.

Useful mostly for development and unittests.

``` javascript
let data = await store.doc('messages/first').data();
data.message // → 'hey there'
```

## async save(data, opts)

Saves Firestore document data.

Useful mostly for development and unittests.

``` javascript
await store.doc('messages/first').save({ message: 'hey there' }, { merge: true });
```

## dashboardURL `→ String`

Firestore dashboard URL.

## openDashboard()

`window.open` Firestore dashboard URL.

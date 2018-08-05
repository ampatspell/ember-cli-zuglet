---
title: Document Reference
pos: 1
---

# Document Reference

``` javascript
let doc = store.doc('ducks/yellow');
let doc = store.collection('ducks').doc('yellow');
```


## id `→ String`

Document id


## parent `→ CollectionReference`

Document parent collection


## path `→ String`

Absolute document path


## collection(name) `→ CollectionReference`

Creates nested collection reference

``` javascript
let doc = store.doc('ducks/yellow');
let coll = doc.collection('feathers');
```


## load({ optional }) `→ Promise<Document>`

Loads a document

If document does not exist:

* `{ optional: false }` → promise is rejected
* `{ optional: true }` → promise is resolved with document which has `{ exists: false }`

``` javascript
let document = await store.doc('ducks/yellow').load();
```


## delete() `→ Promise<DocumentReference>`

Deletes a document

``` javascript
let ref = await store.doc('ducks/yellow').delete();
```


## new() `→ Document`

Builds a new document

``` javascript
let doc = store.doc('ducks/yellow').new({ name: 'Yellow' });
await doc.save();
```


## existing() `→ Document`

Builds a document which is expected to exist

``` javascript
let doc = store.doc('ducks/yellow').existing();
await doc.load();
```

---
pos: 4
---

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

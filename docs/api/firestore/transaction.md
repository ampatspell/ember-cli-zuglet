---
title: Transaction
pos: 4
---

# Transaction

Performs multiple document operations in transaction.

``` javascript
let result = await store.transaction(async tx => {

  let doc = await tx.load(store.doc('messages/first'));
  doc.data.count++;
  await tx.save(doc);

  return { ok: true };
});

result // → { ok: true }
```

## async load(arg, opts) `→ Document or undefined`

Loads a document in transaction.

* `arg` → `Document` or `DocumentReference`
* `opts` → load options.

See [Document](api/firestore/document) and [DocumentReference](api/firestore/reference/document) `load()` for options

## async save(doc, opts) `→ Document`

Saves Document in transaction.

## async delete(arg)

Deletes document in transaction.

* `arg` → `Document` or `DocumentReference`

``` javascript
let ref = store.doc('messages/first');
let doc = ref.existing();

await store.transaction(async tx => {
  await tx.delete(ref);
  await tx.delete(doc);
});
```

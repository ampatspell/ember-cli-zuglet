---
title: Batch
pos: 3
---

# Batch

Creates and commits a Firestore document batch.

``` javascript
await store.batch(batch => {
  batch.save(store.collection('messages').doc().new({ title: 'first' }));
  batch.save(store.collection('messages').doc().new({ title: 'second' }));
});
```

## async commit()

Commits a batch for `store.batch()` use.

``` javascript
let batch = store.batch();
batch.save(store.collection('messages').doc().new({ title: 'first' }));
batch.save(store.collection('messages').doc().new({ title: 'second' }));
await batch.commit();
```

## save(doc, opts)

Saves a document in batch. See [Document](api/firestore/document) `save()` for options.

## delete(arg)

* arg: `Document` or `DocumentReference`

Deletes a document in batch.

``` javascript
let ref = store.doc('messages/first');
let doc = ref.existing();

await store.batch(batch => {
  batch.delete(ref);
  batch.delete(doc);
});
```

---
pos: 5
---

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

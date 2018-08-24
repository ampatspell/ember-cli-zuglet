---
title: Queryable
pos: 3
---

# Queryable Mixin

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

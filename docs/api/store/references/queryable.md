---
title: Queryable
pos: 4
---

# Queryable Reference

## first({ optional, source }) `→ Promise<Document>`

Loads first document. It is not observed by default;

Source:

* `server` → always loaded from the server
* `cache` → loaded from the cache if possible

``` javascript
let document = await store.collection('ducks').first({ optional: true });
```


## load({ source }) `→ Promise<Array<Document>>`

Loads all documents. They are not observed by default.

Source:

* `server` → always loaded from the server
* `cache` → loaded from the cache if possible

``` javascript
let documents = await store.collection('ducks').load();
```


## query() `→ Query`

Creates a long-lived query which can be loaded, reloaded and observed.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.get('content') // → [ Document, ... ]
```


## endAt `→ QueryReference`

creates nested `QueryReference` with endAt


## endBefore `→ QueryReference`

creates nested `QueryReference` with endBefore


## limit `→ QueryReference`

creates nested `QueryReference` with limit


## orderBy `→ QueryReference`

creates nested `QueryReference` with orderBy


## startAfter `→ QueryReference`

creates nested `QueryReference` with startAfter


## startAt `→ QueryReference`

creates nested `QueryReference` with startAt


## where `→ QueryReference`

creates nested `QueryReference` with where

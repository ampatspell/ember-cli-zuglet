---
title: Queryable
pos: 2
---

# Queryable Reference `extends Reference`

Base reference class for both `Collection` and `Queryable` references.

``` javascript
let ref = store.collection('messages').where('owner', '==', 'zeeba').limit(1);
let query = ref.query();
await query.load();
```

## conditions

* `where()`
* `orderBy()`
* `limit(value)`
* `limitToLast()`
* `startAt()`
* `startAfter()`
* `endAt()`
* `endBefore()`

See [Firestore CollectionReference](https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference) docs for more info.

## query({ type }) `→ Query`

Creates a `array` or `first` [Query](api/firestore/query):

* `type` → defaults to `'array'`

``` javascript
let array = store.collection('messages').query();
let first = store.collection('messages').query({ type: 'first' });
```

## async load({ type }) `→ Array<Document>`

* `type` → return type, `doc` or `ref`, defaults to `doc`

Loads documents or document references matching given query

``` javascript
let docs = await store.collection('messsages').where('owner', '==', 'zeeba').load();
docs.length // → 5
docs[0].data.owner // → 'zeeba'
```

``` javascript
let refs = await store.collection('messsages').where('owner', '==', 'zeeba').load({ type: 'ref' });
refs.length // → 5
refs[0] // → DocumentReference
```

## first({ type, optional })

* `type` → return type, `doc` or `ref`, defaults to `doc`
* `optional` → boolean, defaults to `false`

Loads first document matching given query.

``` javascript
let doc = await store.collection('messsages').where('owner', '==', 'zeeba').limit(1).first({ optional: true });
doc.data.owner // → 'zeeba'
```

If query returns no results and optional is:
* `true` → undefined is returned
* `false` → document not found error is thrown

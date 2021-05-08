---
title: Collection
pos: 3
---

# Collection Reference `extends QueryableReference`

See [Queryable Reference](api/firestore/reference/queryable) for query `load`, `query` and condition methods which are shared between `Collection`, `CollectionGroup` and `Condition` references.

``` javascript
let ref = store.collection('messages');
```

## id `→ string`

Document id

## path `→ string`

Document path

## parent `→ DocumentReference`

Creates a new [Document Reference](api/firestore/reference/document) which points to collections's parent

``` javascript
let coll = store.doc('users/zeeba/messages');
let ref = coll.parent;
ref.path // → 'users/zeeba'
```

## doc(path)

Creates a new [Document Reference](api/firestore/reference/document) which points to nested document.

``` javascript
let coll = store.collection('users');
let ref = coll.doc('zeeba');
ref.path // → 'users/zeeba'
```

## dashboardURL `→ String`

Firestore dashboard URL.

## openDashboard()

`window.open` Firestore dashboard URL.

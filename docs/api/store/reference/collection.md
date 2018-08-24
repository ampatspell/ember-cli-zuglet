---
title: Collection
pos: 1
---

# Collection Reference `extends Reference, Queryable`

## doc(path) `→ DocumentReference`

Creates a nested document reference.

``` javascript
let coll = store.collection('ducks');
let ref = coll.doc('yellow'); // → document reference for 'ducks/yellow'
```

``` javascript
let coll = store.collection('ducks');
let ref = coll.doc('yellow/orders/first'); // → document reference for 'ducks/yellow/orders/first'
```

---
title: Query
pos: 3
---

# Query Reference `extends QueryableReference`

``` javascript
let ref = store
  .collection('ducks')
  .where('name', '==', 'yellow')
  .orderBy('name')
  .limit(10);

let query = ref.query();
await query.load();
```

## parent `→ QueryReference | CollectionReference`

Parent reference.

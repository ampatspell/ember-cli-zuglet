---
title: Region
pos: 0
---

# Region

## identifier `→ string`

Region identifier

``` javascript
let region = store.functions.region();
region.identifier // → 'us-central1'
```

## async call(name, props) `→ object`

Calls Firebase callable function.

``` javascript
let region = store.functions.region();
let result = await region.call('hello', { ok: true });
result // → { data: { … } }
```

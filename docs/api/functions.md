---
title: Functions
pos: 6
---

# Functions

``` javascript
let functions = store.functions;
let response = await functions.call('hello', { ok: true });
response // → { data: { … } }
```

## async call(name, props) `→ object`

Calls Firebase callable function in default region.

Alias for `functions.region().call(...args)`

## region()

Returns default region.

See [Store](api/store) `options.functions` on how to setup custom default region.

## region(identifier)

Returns custom region.

``` javascript
let region = functions.region('europe-west1');
await region.call('hello', { ok: true });
```

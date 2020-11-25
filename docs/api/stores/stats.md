---
title: Stats
pos: 0
---

# Stats

List of currently:

* activated models, documents, queries, …
* observed documents, queries, auth, tasks
* pending promises

``` javascript
import { getStores } from 'zuglet/utils';

let stats = getStores(this).stats;
```

``` javascript
let stats = store.stores.stats;
```

## activated

List of activated models, documents, queries, …

Useful for debugging.

## observers

List of documents, queries, auth state change and storage tasks being observed.

Useful for debugging.

## promises

List of currently running promises which are not yet settled. Each promise has `stats` property with `{ model, label }` for debugging.

``` javascript
let promise = stats.promises[0];
promise.stats.model // → <Document…>
promise.stats.label // → 'load'
```

## async settle()

Resolves when all currently running `stats.promises` settle.

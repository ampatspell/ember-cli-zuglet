---
title: Stores
pos: 7
---

# Stores

Stores manages any [Store](api/store) instances used in the app.

Singleton, accessible using `getStores()` helper

``` javascript
import { getStores } from 'zuglet/utils';
let stores = getStores(this);
```

## stats `→ Stats`

Returns singleton [Stats](api/stores/stats) instance.

## models `→ Models`

Returns singleton [Models](api/models) instance.

## createStore(identifier, factory) `→ Store`

Creates a new store.

``` javascript
import BaseStore from 'zuglet/store';

class Store extends BaseStore {
}

let store = getStores(this).createStore('store', Store);
```

## store(identifier, { optional })

Returns existing store.

* `optional` → boolean, defaults to false

``` javascript
let missing = getStores(this).store('missing', { optional: true });
missing // → undefined

let existing = getStores(this).store('existing');
existing // → Store
```

## async settle() → undefined

Alias for `stores.stats.settle()`

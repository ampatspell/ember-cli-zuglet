---
title: Utils
pos: 9
---

# Utils

``` javascript
import {
  getStores,
  setGlobal,
  objectToJSON,
  toString,
  toPrimitive,
  toJSON,
  isZugletError,
  load,
  alive,
  delay,
  activate,
  isActivated,
  defer
} from 'ember-cli-zuglet/utils';
```

## load

``` js
import { load } from 'zuglet/utils';

await load.cached(this.doc);
await load.remote(this.doc);

await load(this.store.auth);
```

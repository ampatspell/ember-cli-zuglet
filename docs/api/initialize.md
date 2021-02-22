---
title: Initialize
pos: 0
---

# Initialize

Ember.js instance initializer helper which creates a [Store](api/store) instance based on provided parameters.

``` javascript
// app/instance-initializers/ducks-store.js
import { initialize } from 'zuglet/initialize';
import Store from '../store';

export default {
  name: 'ducks:store',
  initialize(app) {
    initialize(app, {
      store: {
        identifier: 'store', // defaults to `store`
        factory: Store       // required
      },
      service: {
        enabled: true, // defaults to `true`
        name: 'store'  // defaults to `store.identifier`
      },
      development: {
        enabled: true,  // defaults to `true`
        logging: true,  // defaults to `true`
        export: 'store' // defaults to `store.identifier`
      }
    });
  }
}
```

## Flags

``` javascript
// ember-cli-build.js
let app = new EmberApp(defaults, {
  zuglet: {
    proxyClassicSupport: false
  }
});
```

* `proxyClassicSupport` → if enabled, for compatibility with `computed`, `doc.data` will invoke `notifyPropertyChange`. Defaults to `false`

---
pos: 1
---

``` javascript
import { register, initialize } from 'ember-cli-zuglet/initialize';
```

Instance initializer helper to register zuglet store(s) in application container. See `Store` documentation for manual registration using `zuglet:stores` singleton.

# Configuration

`register` and `initialize` takes the same configuration which:

* setups store instance,
* registers instance as a service,
* prepares injections
* optionally sets store instance to `window` (only in development environemtn)

> Note: only `store.factory` is required. Everything else has defaults.

``` javascript
{
  store: {
    identifier: 'store', // defaults to 'store'
    factory: Store       // required
  },
  service: {
    enabled: true,       // default
    name: 'store',       // defaults to `store.identifier`
    inject: [ 'route', 'controller', 'component', 'model' ], // default
  },
  development: {
    enabled: true,       // default
    export: 'store',     // defaults to `store.identifier`
    logging: true        // default
  }
}
```

# Initialize

``` javascript
// app/instance-initializers/app-store.js
import { initialize } from 'ember-cli-zuglet/initialize';
import Store from '../store';

export default {
  name: 'app:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    }
  })
}
```

# Register

Use `register` to register multiple stores in a single `instance-initializer`.

``` javascript
// app/instance-initializers/app-store.js
import { register } from 'ember-cli-zuglet/initialize';
import Store from '../store';

export default {
  name: 'app:store',
  initialize(app) {

    register(app, {
      store: {
        identifier: 'store',
        factory: Store
      }
    });

  }
}
```

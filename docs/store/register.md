---
pos: 1
---

# Register

``` javascript
// app/instance-initializers/app-store.js
import register from 'ember-cli-zuglet/register';
import Store from '../store';

export default {
  name: 'app:store',
  initialize(app) {
    register({
      app,
      store: {
        identifier: 'store',
        factory: Store
      },
      service: {
        enabled: true, // default
        name: 'store', // defaults to store.identifier
        inject: [ 'route', 'controller', 'component' ], // default
      },
      development: {
        enabled: true,  // default
        export: 'store' // defaults to store.identifier
      }
    });
  }
}
```

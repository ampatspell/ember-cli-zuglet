---
pos: 7
---

# Stores

``` javascript
let stores = getOwner(this).lookup('zuglet:stores');
```

## ready `→ Promise`

A `Promise` which is resolved when all currently instantiated `Store` instances are ready to be used.

``` javascript
await store.ready;
```

``` javascript
// app/routes/application.js
import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    return this.store.ready;
  }
});
```

## createStore(identifier, factory) `→ Store`

Creates and registers a new `Store` instance.

* `identifier`: store identifier
* `factory`: `Store` subclass

``` javascript
// app/instance-initializers/zuglet-store.js
import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    // apiKey: '',
    // authDomain: '',
    // databaseURL: '',
    // projectId: '',
    // storageBucket: '',
  },
  firestore: {
    persistenceEnabled: true
  }
};

const MainStore = Store.extend({

  options,

  restoreUser(user) {
  },

  restore() {
  }

});

export default {
  name: 'store',
  initialize(app) {
    let store = app.lookup('zuglet:stores').createStore('main', MainStore);
    app.register('service:store', store, { instantiate: false });
  }
}
```

> TODO: See Register & Initialize helpers for easier store setup.

## settle() `→ Promise`

Returns a `Promise` which resolves when all currently running operations for all currently registered stores are finished.

> TODO: See `store.settle`

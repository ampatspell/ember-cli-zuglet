---
pos: 3
---

# Store

## Create store

``` javascript
// app/store.js
import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    // apiKey: "",
    // authDomain: "",
    // databaseURL: "",
    // projectId: "",
    // storageBucket: "",
    // messagingSenderId: ""
  },
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options

});
```

``` javascript
import Store from './store';

let stores = getOwner(this).lookup('zuglet:stores');
let store = stores.createStore('main', Store);
```


## store.identifier `→ String`

Store identifier used when this store was created.


## store.options `→ Object`

Override this property and provide firebase and firestore options.


## store.restore()

> TODO


## store.restoreUser(user)

> TODO


## store.object `→ DataObject`

> TODO


## store.array `→ DataArray`

> TODO


## store.auth `→ Auth`

> TODO


## store.storage `→ Storage`

> TODO


## store.ready `→ Promise`

Store is ready to be used after `store.ready` resolves.

``` javascript
store.get('ready').then(() => {
  // use store
})
```

``` javascript
// app/routes/application.js
import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    return this.get('store.ready');
  }
});
```


## store.collection(name) `→ CollectionReference`

``` javascript
let ducks = store.collection('ducks');
```


## store.doc(path) `→ DocumentReference | CollectionReference`

``` javascript
let duck = store.doc('ducks/yellow');
```


## store.settle() `→ Promise`

Returns a Promise which resolves when all currently running operations finishes.

Operations may include:

* document gets
* document saves, deletes
* query gets
* auth tasks
* storage tasks

## store.observed `→ Array<Document | Query>`

Contains all documents and queries which are observing `onSnapshot` at the moment.

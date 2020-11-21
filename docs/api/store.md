---
title: Store
pos: 1
---

# Store

``` javascript
import BaseStore from 'zuglet/store';

export default class Store extends BaseStore {

  options

}
```

## options

Override to provide Firebase SDK and `ember-cli-zuglet` configuration:

``` javascript
options = {

  // required
  firebase: {
    apiKey: '…',
    authDomain: '…',
    databaseURL: '…',
    projectId: '…',
    storageBucket: '…',
    messagingSenderId: '…',
    appId: '…'
  },

  firestore: {
    persistenceEnabled: true // defaults to `false`
  },

  auth: {
    user: 'user' // defaults to null
  },

  functions: {
    region: null // defaults to null
  },

  // defaults to no emulators configured
  emulators: {
    host: 'localhost',
    auth: 9099,
    firestore: 8080,
    functions: 5001
  }

}
```

## normalizedOptions `→ Object`

Normalized options with all defaults expanded

## identifier `→ String`

Unique `Store` identifier which can be used to distinguish multiple stores in runtime.

## models `→ Models`

## auth `→ Auth`

## storage `→ Storage`

## functions `→ Functions`

## doc(path) `→ DocumentReference`

## collection(path) `→ CollectionReference`

## async transaction(callback) `→ Transaction`

## batch(callback) `→ any`

## batch() `→ Batch`

## serverTimestamp `→ firestore.FieldValue`

## onObserverError(model, error)

## projectId `→ String`

## dashboard `→ String`

## openDashboard()

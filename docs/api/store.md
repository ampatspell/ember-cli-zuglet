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

* firebase
* firestore
* auth
* functions
* emulators

## normalizedOptions `→ Object`

Normalized options with all defaults expanded

## identifier `→ String`

Unique `Store` identifier which can be used to distinguish multiple stores.

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

## serialized `→ Object`

## toJSON() `→ Object`

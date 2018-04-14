# ember-cli-zuglet

Simplification.

Identity-less, model-less persistence for Google Cloud Firestore. Just store, documents and queries.

* [Setup](#setup)
* [Store](#store)
   * [store.ready](#storeready)
   * [store.observed](#storeobserved)
   * [store.identifier](#storeidentifier)
   * [store.collection(name)](#storecollectionname)
   * [store.doc(path)](#storedocpath)
   * [store.settle()](#storesettle)
* [DocumentReference](#documentreference)
   * [id](#id)
   * [parent](#parent)
   * [path](#path)
   * [collection(name)](#collectionname)
   * [load({ optional })](#load-optional-)
   * [new()](#new)
* [CollectionReference extends QueryableReference](#collectionreference-extends-queryablereference)
   * [id](#id-1)
   * [path](#path-1)
   * [parent](#parent-1)
   * [doc(name)](#docname)
* [QueryReference extends QueryableReference](#queryreference-extends-queryablereference)
   * [parent](#parent-2)
* [QueryableReference](#queryablereference)
   * [endAt](#endat)
   * [endBefore](#endbefore)
   * [limit](#limit)
   * [orderBy](#orderby)
   * [startAfter](#startafter)
   * [startAt](#startat)
   * [where](#where)
   * [first({ optional })](#first-optional-)
   * [load()](#load)
   * [query()](#query)
* [Query](#query-1)
   * [isArray](#isarray)
   * [isFirst](#isfirst)
   * [state](#state)
   * [serialized](#serialized)
   * [ref](#ref)
   * [size](#size)
   * [metadata](#metadata)
   * [observe()](#observe)
* [Document](#document)
   * [id](#id-2)
   * [path](#path-2)
   * [serialized](#serialized-1)
   * [state](#state-1)
   * [meta](#meta)
   * [data](#data)
   * [load()](#load-1)
   * [reload()](#reload)
   * [save()](#save)
   * [delete()](#delete)
   * [observe()](#observe-1)

## Setup

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
        enabled: true, // default
        export: 'store' // defaults to store.identifier
      }
    });
  }
}
```

## Store

``` javascript
import Store from './store';

let stores = getOwner(this).lookup('zuglet:stores');
let store = stores.createStore('main', Store);
```

### store.ready
`→ Promise`

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

### store.observed
`→ Array`

Contains all documents and queries which are observing `onSnapshot`.

### store.identifier
`→ String`

Store identifiers

### store.collection(name)
`→ CollectionReference`

``` javascript
let ducks = store.collection('ducks');
```

### store.doc(path)
`→ DocumentReference or CollectionReference`

``` javascript
let duck = store.doc('ducks/yellow');
```

### store.settle()
`→ Promise`

Resolves when all currently running operations (loads, saves, query gets) finishes.

## DocumentReference

``` javascript
let doc = store.doc('ducks/yellow');
let doc = store.collection('ducks').doc('yellow');
```

### id
`→ String`

document id

### parent
`→ CollectionReference`

document parent collection

### path
`→ String`

absolute document path

### collection(name)
`→ CollectionReference`

creates nested collection reference

``` javascript
let doc = store.doc('ducks/yellow');
let coll = doc.collection('feathers');
```

### load({ optional })
`→ Promise for Document`

Loads a document.

If document does not exist:

* `{ optional: false }` → promise is rejected
* `{ optional: true }` → promise is resolved with document which has `{ exists: false }`

``` javascript
let document = await store.doc('ducks/yellow').load();
```

### new()
`→ Document`

Builds a new document.

``` javascript
let doc = store.doc('ducks/yellow').new({ name: 'Yellow' });
await doc.save();
```

## CollectionReference extends QueryableReference

``` javascript
let ducks = store.collection('ducks');
let feathers = ducks.doc('yellow').collection('feathers');
let things = store.doc('ducks/yellow').collection('things');
```

### id
`→ String`

collection id

### path
`→ String`

collection absolute path

### parent
`→ DocumentReference`

parent document reference or null

### doc(name)
`→ DocumentReference`

creates nested document reference

``` javascript
let doc = store.collection('ducks').doc('yellow');
```

## QueryReference extends QueryableReference

``` javascript
let ref = store
  .collection('ducks')
  .where('name', '==', 'yellow')
  .orderBy('name')
  .limit(10);

let query = ref.query();
await query.load();
```

### parent
`→ QueryableReference`

parent for this reference. may be CollectionReference or QueryReference

## QueryableReference

### endAt
`→ QueryReference`

creates nested QueryReference with endAt

### endBefore
`→ QueryReference`

creates nested QueryReference with endBefore

### limit
`→ QueryReference`

creates nested QueryReference with limit

### orderBy
`→ QueryReference`

creates nested QueryReference with orderBy

### startAfter
`→ QueryReference`

creates nested QueryReference with startAfter

### startAt
`→ QueryReference`

creates nested QueryReference with startAt

### where
`→ QueryReference`

creates nested QueryReference with where

### first({ optional })
`→ Promise for Document`

Loads first document. It is not observed by default;

``` javascript
let document = await store.collection('ducks').first({ optional: true });
```

### load()
`→ Promise for [ Document, ... ]`

Loads all documents. They are not observed by default.

``` javascript
let documents = await store.collection('ducks').load();
```

### query()
`→ Query`

Creates a long-lived query which can be loaded, reloaded and observed.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.get('content') // → [ Document, ... ]
```

## Query

Creates a long lived query instance which can be loaded, reloaded and observed.

Type can be:

* `array`
* `first`

``` javascript
let query = store.collection('ducks').query({ type: 'array' });
await query.load();
```

``` javascript
let query = store.collection('ducks').query({ type: 'array' });
let cancel = query.observe();

// stop observing onSnapshot changes
cancel();

// or just destroy query
query.destroy();
```

### isArray
`→ Boolean`

return true if type is array

### isFirst
`→ Boolean`

return true if type is first

### state

* isLoading
* isLoaded
* isError
* error

``` javascript
query.get('isLoading'); // → Bolean
```

### serialized
`→ Object`

Serializes query state and meta as a single object. For debugging.

``` javascript
let json = query.get('serialized');
```

``` json
{
  "isLoading": false,
  "isLoaded": true,
  "isObserving": true,
  "isError": false,
  "error": null,
  "type": "array",
  "empty": false,
  "size": 4,
  "metadata": {
    "fromCache": false,
    "hasPendingWrites": false
  }
}
```

### ref
`→ QueryReference or CollectionReference`

reference with which this query was created.

### size
`→ Number`

latest `onSnapshot` size property.

### metadata
`→ Object`

latest `onSnapshot` metadata

### observe()
`→ function`

Starts observing query onSnapshot changes. Returns function which can be used to stop observation.

``` javascript
let query = await store.collection('ducks').query({ type: 'array' });
let cancel = query.observe();

// to stop observing
cancel();

// or just destroy query
query.destroy();
```

## Document

Represents single local-only or loaded document.

``` javascript
let doc = store.doc('ducks/yellow').new();
doc.set('data.name', 'yellow');
doc.save();
```

``` javascript
let doc = await store.doc('ducks/yellow').load();
```

### id
`→ String`

Document id

### path
`→ String`

Document absolute path

### serialized
`→ Object`

Serializes doc state, meta and data as a single object. For debugging.

``` javascript
let json = doc.get('serialized');
```

``` json
{
  "id": "blue",
  "path": "ducks/blue",
  "isNew": false,
  "isLoading": false,
  "isLoaded": true,
  "isSaving": false,
  "isObserving": true,
  "isError": false,
  "error": null,
  "exists": true,
  "metadata": {
    "fromCache": true,
    "hasPendingWrites": false
  },
  "data": {
    "name": "blue"
  }
}
```

### state

* isNew
* isLoading
* isLoaded
* isSaving
* isObserving
* isError
* error

### meta

* exists
* metadata

### data
`→ TODO`

Document data

### load()
`→ Promise`

Loads document if it is not yet loaded.

### reload()
`→ Promise`

Reloads document.

### save()
`→ Promise`

Saves document.

### delete()
`→ Promise`

Deletes document.

### observe()
`→ function`

Starts observing document onSnapshot changes. Returns function which can be used to stop observation.

``` javascript
let doc = await store.doc('ducks/yellow').load();
let cancel = doc.observe();

// to stop observing
cancel();

// or just destroy document
doc.destroy();
```

## TODO

* `store.object`
* `store.array`
* `doc.data`
* `doc.reset()`
* `store.auth`
* `store.onRestoreUser`

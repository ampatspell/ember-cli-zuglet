# ember-cli-zuglet

Simplification.

Identity-less, model-less persistence for Google Cloud Firestore. Just store, documents and queries.

* [Setup](#setup)
* [Store](#store)
   * [store.ready → Promise](#storeready--promise)
   * [store.observed → Array](#storeobserved--array)
   * [store.identifier → String](#storeidentifier--string)
   * [store.collection(name) → CollectionReference](#storecollectionname--collectionreference)
   * [store.doc(path) → DocumentReference or CollectionReference](#storedocpath--documentreference-or-collectionreference)
   * [store.settle() → Promise](#storesettle--promise)
* [DocumentReference](#documentreference)
   * [id → String](#id--string)
   * [parent → CollectionReference](#parent--collectionreference)
   * [path → String](#path--string)
   * [collection(name) → CollectionReference](#collectionname--collectionreference)
   * [load({ optional }) → Promise for Document](#load-optional---promise-for-document)
   * [new() → Document](#new--document)
* [CollectionReference extends QueryableReference](#collectionreference-extends-queryablereference)
   * [id → String](#id--string-1)
   * [path → String](#path--string-1)
   * [parent → DocumentReference](#parent--documentreference)
   * [doc(name) → DocumentReference](#docname--documentreference)
* [QueryReference extends QueryableReference](#queryreference-extends-queryablereference)
   * [parent → QueryableReference](#parent--queryablereference)
* [QueryableReference](#queryablereference)
   * [endAt](#endat)
   * [endBefore](#endbefore)
   * [limit](#limit)
   * [orderBy](#orderby)
   * [startAfter](#startafter)
   * [startAt](#startat)
   * [where](#where)
   * [first({ optional }) → Promise for Document](#first-optional---promise-for-document)
   * [load() → Promise for [ Document, ... ]](#load--promise-for--document--)
   * [query() → Query](#query--query)
* [Query](#query)
   * [isArray → Boolean](#isarray--boolean)
   * [isFirst → Boolean](#isfirst--boolean)
   * [state](#state)
   * [query → QueryReference or CollectionReference](#query--queryreference-or-collectionreference)
   * [size](#size)
   * [metadata](#metadata)
* [Document](#document)
   * [id](#id)
   * [path](#path)
   * [data → TODO](#data--todo)
   * [load() → Promise](#load--promise)
   * [reload() → Promise](#reload--promise)
   * [save() → Promise](#save--promise)
   * [delete() → Promise](#delete--promise)
   * [observe() → cancellable](#observe--cancellable)

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
import Store from '../store';

export default {
  name: 'app:store',
  initialize(app) {
    let stores = app.lookup('zuglet:stores');
    let store = stores.createStore('main', Store);

    app.register('service:store', store, { instantiate: false });

    app.inject('component', 'store', 'service:store');
    app.inject('route', 'store', 'service:store');
  }
};
```

## Store

``` javascript
import Store from './store';

let stores = getOwner(this).lookup('zuglet:stores');
let store = stores.createStore('main', Store);
```

### store.ready → Promise

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

### store.observed → Array

Contains all documents and queries which are observing `onSnapshot`.

### store.identifier → String

Store identifiers

### store.collection(name) → CollectionReference

``` javascript
let ducks = store.collection('ducks');
```

### store.doc(path) → DocumentReference or CollectionReference

``` javascript
let duck = store.doc('ducks/yellow');
```

### store.settle() → Promise

Resolves when all currently running operations (loads, saves, query gets) finishes.

## DocumentReference

``` javascript
let doc = store.doc('ducks/yellow');
let doc = store.collection('ducks').doc('yellow');
```

### id → String

document id

### parent → CollectionReference

document parent collection

### path → String

absolute document path

### collection(name) → CollectionReference

creates nested collection reference

``` javascript
let doc = store.doc('ducks/yellow');
let coll = doc.collection('feathers');
```

### load({ optional }) → Promise for Document

Loads a document.

If document does not exist:

* `{ optional: false }` → promise is rejected
* `{ optional: true }` → promise is resolved with document which has `{ exists: false }`

``` javascript
let document = await store.doc('ducks/yellow').load();
```

### new() → Document

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

### id → String

collection id

### path → String

collection absolute path

### parent → DocumentReference

parent document reference or null

### doc(name) → DocumentReference

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

### parent → QueryableReference

parent for this reference. may be CollectionReference or QueryReference

## QueryableReference

### endAt

creates nested QueryReference with endAt

### endBefore

creates nested QueryReference with endBefore

### limit

creates nested QueryReference with limit

### orderBy

creates nested QueryReference with orderBy

### startAfter

creates nested QueryReference with startAfter

### startAt

creates nested QueryReference with startAt

### where

creates nested QueryReference with where

### first({ optional }) → Promise for Document

Loads first document. It is not observed by default;

``` javascript
let document = await store.collection('ducks').first({ optional: true });
```

### load() → Promise for [ Document, ... ]

Loads all documents. They are not observed by default.

``` javascript
let documents = await store.collection('ducks').load();
```

### query() → Query

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

### isArray → Boolean

return true if type is array

### isFirst → Boolean

return true if type is first

### state

``` javascript
query.get('isLoading'); // → Bolean
query.get('state'); // → Object
```

``` javascript
{
  isLoading: false,
  isLoaded:  false,
  isError:   false,
  error:     null  
}
```

### query → QueryReference or CollectionReference

reference with which this query was created.

### size

latest `onSnapshot` size property.

### metadata

latest `onSnapshot` metadata

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

Document id

### path

Document absolute path

### data → TODO

Document data

### load() → Promise

Loads document if it is not yet loaded.

### reload() → Promise

Reloads document.

### save() → Promise

Saves document.

### delete() → Promise

Deletes document.

### observe() → cancellable

Starts observing document onSnapshot changes.

``` javascript
let doc = await store.doc('ducks/yellow').load();
let cancel = doc.observe();

// to stop observing
cancel();

// or just destroy document
doc.destroy();
```

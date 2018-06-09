---
pos: 3
---

# Document

Represents single local-only or loaded document.

``` javascript
let doc = store.doc('ducks/yellow').new();
doc.set('data.name', 'yellow');
doc.save();
```

``` javascript
let doc = await store.doc('ducks/yellow').load();
```


## id `→ String`

Document id


## path `→ String`

Document absolute path


## serialized `→ Object`

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

## state

* isNew
* isLoading
* isLoaded
* isSaving
* isObserving
* isError
* error

## meta

* exists
* metadata

## data `→ DataObject`

Document data

> TODO


## reset()

> TODO


## load() `→ Promise`

Loads document if it is not yet loaded.


## reload() `→ Promise`

Reloads document.

## save() `→ Promise`

Saves document.


## delete() `→ Promise`

Deletes document.


## observe() `→ DocumentObserver`

Starts observing document onSnapshot changes. Returns document observer.

``` javascript
let doc = await store.doc('ducks/yellow').load();
let observer = doc.observe();

// get document which is being observerd by this observer
let doc = observer.doc;

// wait for 1st snapshot (may come from local cache)
await observer.promise;

// returns the same promise
await observer.load();

// to stop observing
observer.cancel();

// or just destroy document or observer
doc.destroy();
observer.destroy();
```

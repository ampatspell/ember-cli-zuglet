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


## observe() `→ function`

Starts observing document onSnapshot changes. Returns function which can be used to stop observation.

``` javascript
let doc = await store.doc('ducks/yellow').load();
let cancel = doc.observe();

// to stop observing
cancel();

// or just destroy document
doc.destroy();
```

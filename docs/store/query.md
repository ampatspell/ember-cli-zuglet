---
pos: 4
---

# Query

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
let { cancel, promise } = query.observe();

// wait for 1st snapshot
await promise;

// stop observing onSnapshot changes
cancel();

// or just destroy query
query.destroy();
```


## isArray `→ Boolean`

return true if type is array

## isFirst `→ Boolean`

return true if type is first


## state

* isLoading
* isLoaded
* isError
* error

``` javascript
query.get('isLoading'); // → Bolean
```

## serialized `→ Object`

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


## ref `→ QueryReference | CollectionReference`

reference with which this query was created.

## size `→ Number`

latest `onSnapshot` size property.


## metadata `→ Object`

latest `onSnapshot` metadata


## observe() `→ QueryObserver`

Starts observing query onSnapshot changes. Returns query observer.

``` javascript
let query = await store.collection('ducks').query({ type: 'array' });
let observer = query.observe();

// get query which is being observerd by this observer
let query = observer.query;

// wait for 1st snapshot (may come from local cache)
await observer.promise;

// returns the same promise
await observer.load();

// to stop observing
observer.cancel();

// or just destroy query or observer
query.destroy();
observer.destroy();
```

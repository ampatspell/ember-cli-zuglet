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


## observe() `→ function`

Starts observing query onSnapshot changes. Returns function which can be used to stop observation.

``` javascript
let query = await store.collection('ducks').query({ type: 'array' });
let cancel = query.observe();

// to stop observing
cancel();

// or just destroy query
query.destroy();
```

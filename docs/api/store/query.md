---
pos: 2
---

# Query

## isQuery `→ true`

Always returns `true` for Query instances.

## ref `→ CollectionReference|QueryReference`

Returns collection or query reference associated with this query.

## type `→ String`

Type of this query, either `array` or `first`.

## isArray `→ Boolean`

Alias for `type === 'array'`

## isFirst `→ Boolean`

Alias for `type === 'first'`

## Query state

* `isLoading`
* `isLoaded`
* `isObserving`
* `isError`
* `error`

## size `→ Number|undefined`

Returns number of documents fetched by this query.

## empty `→ Boolean|undefined`

`True` if query yielded zero results.

## metadata `→ Object|undefined`

Query metadata.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.metadata
// →
// {
//   fromCache: false,
//   hasPendingWrites: false
// }
```

## content `→ Array<Document>|Docuemnt`

Query result or results, depending on the `type`:

* `array` → array of `Document` instances
* `first` → `Document` or null

## load({ source, force }) `→ Promise<Query>`

Loads a query.

* `source` → `Boolean`: 'server' or 'cache' (defaults to `server`)
* `force` → `Boolean`: (defaults to `false`)

If `source` is `cache`, cached documents are returned, if query is not in the cache, up-to-date response is returned from the server.

If `force` is `false` and query is already loaded, it is not reloaded. On the other hand, if `force` is `true`, query is always reloaded.

``` javascript
let query = store.collection('ducks').query();
await query.load(); // → loads
await query.load({ force: true }); // → reloads
query.content // → [ Document, … ]
```

## observe() `→ Observer`

Creates a new query observer and immediately starts observing query for changes which includes added, removed and updated documents.

``` javascript
let query = store.collection('ducks').query();
let observer = query.observe();

await observer.load();

query.isLoaded // → true
observer.cancel();
```

While there may be multiple Observer instances for each query, Query always has up to one actual `ref.onSnapshot` observer.

It is more efficient to observe query instead of observing each separate document.

**Note:** Make sure you cancel all unnecessary observers.

> TODO: See `observed()`

## observers `→ Observers`

Returns array of Observers currently observing this query.

``` javascript
let query = store.collection('ducks').query();
let observer = query.observe();

let observers = query.observers; // → [ observer ]
await observers.promise;

query.isLoaded // → true
observer.cancel();
```

## serialized `→ Object`

Returns json representation of query most important properties.

Useful for debugging.

``` javascript
let query = store.collection('ducks').query();
await query.load();
query.serialized
// →
// {
//   isLoading: false,
//   isLoaded: true,
//   isObserving: false,
//   isError: false,
//   error: null,
//   type: 'array',
//   size: 42,
//   empty: false,
//   metadata: {
//     fromCache: false,
//     hasPendingWrites: false
//   }
// }
```

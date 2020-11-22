---
title: Query
pos: 2
---

# Query

Query encapsulates [Queryable Reference](api/firestore/reference/queryable), load state and content.

There are two query types - `array` and `first` and they differ only by content.

## state

* isLoading
* isLoaded
* isError
* error

## content `→ Array<Document> or Document`

``` javascript
let array = store.collection('messages').query();
await array.load();
array.content // → Array<Document>
```

``` javascript
let first = store.collection('messages').limit(1).query({ type: 'first' });
await first.load()
first.content // → Document or null
```

## passive() `→ this`

Makes query not to subscribe to onSnapshot observer. Instead, when query is activated, it is loaded using `query.load()`

``` javascript
class Model extends EmberObject {

  @activate().content(({ store }) => store.collection('messages').query().passive())
  query

  async load() {
    await this.promise.promise; // resolves when query is loaded
  }

}
```

## promise `→ Promise<this>`

Resolves when query is loaded either by `query.load()` or when first `onSnapshot` is processed.

> Note: promise doesn't automatically do a load. You need to activate query using `@activate` decorator for this to work as expected

## async load(opts) `→ this`

* `force` → boolean. defaults to false

Loads query if it is not yet loaded. If `force` is true, query is always loaded.

``` javascript
let query = store.collection('messages').query();
await query.load(); // does load
await query.load(); // does nothing
await query.load({ force: true }); // does load even if query is already loaded
```

## reload()

Alias for `query.load({ force: true })`

## register(doc)

Registers document for reuse in query content.

``` javascript
let query = store.collection('messages').query();

let doc = store.collection('messages').doc().new({
  title: 'hey there'
});

query.register(doc);

await query.load();
query.content.includes(doc) // → true
```

Useful in rare cases where you have a reference to document and you need the same document instance in a query content when next `onSnapshot` is triggered.

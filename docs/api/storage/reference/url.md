---
title: URL
pos: 1
---

# Storage Reference URL

Represents a stateful public url for a single file.

``` javascript
let url = storage.ref('hello').url;
await url.load();
url.value // → https://…
```

## ref `→ StorageReference`

Returns a storage reference associated with this metadata instance.

## State properties

* `isLoading` → `Boolean`
* `isLoaded` → `Boolean`
* `isError` → `Boolea`
* `error` → `Object | null`
* `exists` → `Boolean | undefined`

## load(opts) `→ Promise<StorageReferenceURL>`

Loads public URL for associated storage reference.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

## value `→ String`

Public URL for associated storage reference.

## serialized `→ object`

Returns json representation of most important properties.

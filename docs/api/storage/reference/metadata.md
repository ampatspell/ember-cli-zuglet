---
title: Metadata
pos: 0
---

# Storage Reference Metadata

Represents a stateful metadata information about single file.

``` javascript
let metadata = storage.ref('hello').metadata;
```

## ref `→ StorageReference`

Returns a storage reference associated with this metadata instance.

## load({ optional }) `→ Promise<StorageReference>`

Loads metadata for associated storage reference.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

``` javascript
let metadata = storage.ref('hello').metadata;

metadata.isLoaded // → false

await metadata.load();

metadata.isLoaded // → true
metadata.exists // → true
```

## update(object) `→ Promise<StorageReference>`

Updates file metadata.

``` javascript
let metadata = storage.ref('hello').metadata;
await metadata.update({
  contentType: 'text/plain',
  customMetadata: {
    hello: 'world'
  }
});
```

## State properties

* `isLoading` → `Boolean`
* `isLoaded` → `Boolean`
* `isError` → `Boolean`
* `error` → `Object | null`
* `exists` → `Boolean | undefined`

## Metadata properties

* `raw` → `Object`
* `type` → `String`
* `name` → `String`
* `size` → `Number`
* `contentType` → `String`
* `customMetadata` → `Object`
* `cacheControl` → `String`
* `contentDisposition` → `String`
* `contentEncoding` → `String`
* `contentLanguage` → `String`
* `bucket` → `String`
* `fullPath` → `String`
* `md5Hash` → `String`
* `generation` → `String`
* `metageneration` → `String`
* `createdAt` → `Date`
* `updatedAt` → `Date`

## serialized `→ object`

Returns json representation of most important properties.

Useful for debugging.

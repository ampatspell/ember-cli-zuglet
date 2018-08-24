---
title: Reference
pos: 0
---

# Storage Reference

Storage reference represents a file location with stateful metadata and url.

## parent `→ StorageReference`

Creates and returns a new storage reference for parent.

``` javascript
let ref = storage.ref('pictures/duck')
ref.parent; // → StorageReference for 'pictures'
ref.parent.parent // → null
```

## ref(path) `→ StorageReference`

Creates and returns a new storage reference for a child file location.

``` javascript
let ref = storage.ref('pictures');
ref.ref('duck') // → StorageReference for 'pictures/duck'
ref.ref('duck/profile-picture') // → StorageReference for 'pictures/duck/profile-picture'
```

## fullPath `→ String`

Returns a full file location path

``` javascript
let ref = storage.ref('pictures/duck');
ref.fullPath // → 'pictures/duck'
```

## bucket `→ String`

Returns a name of the bucket where file is stored.

``` javascript
let ref = storage.ref('pictures/duck');
ref.bucket // → '<app-id>.appspot.com'
```

## name `→ String`

Returns a filename

## metadata `→ StorageReferenceMetadata`

Returns a `StorageReferenceMetadata` instance for this reference.

> TODO: See StorageReferenceMetadata

## url `→ StorageReferenceURL`

Returns a `StorageReferenceURL` instance for this reference.

> TODO: See StorageReferenceURL

## load({ url, metadata, optional }) `→ Promise<StorageReference>`

Loads reference metadata and/or url.

* `url` → Boolean (defaults to `false`)
* `metadata` → Boolean (defaults to `false`)
* `optional` → Boolean (defaults to `false`)

If both `url` and `metadata` are `false`, both are set to true.

``` javascript
let ref = storage.ref('duck/yellow');
await ref.load(); // → StorageReference with metadata and url loaded
```

If file does not exist and `optional` is `false`, load `Promise` rejects with an object not found error.

## delete({ optional }) `→ Promise<StorageReference>`

Deletes a file.

* `optional` → Boolean (defaults to `false`)

If file does not exist and `optional` is `false`, delete `Promise` rejects.

## put({ type, data, format, metadata }) `→ StorageTask`

Creates and returns a `StorageTask` and starts uploading a `Blob`, `File` or `String`.

* `type` → 'file' or 'string'
* `data` → `File`, `Blob` or `String`
* `format` → String (only for `{ type: 'string' }`)
* `metadata` → Object

String formats:

* `raw`
* `base64`
* `base64-url`
* `data-url`

``` javascript
let task = storage.ref('hello').put({
  type: 'string',
  data: 'This is content',
  format: 'raw',
  metadata: {
    contentType: 'text/plain',
    customMetadata: {
      ok: true
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: new Blob([ 'This is content' ]),
  metadata: {
    contentType: 'text/plain',
    customMetadata: {
      ok: true
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type,
    customMetadata: {
      originalFilename: file.name
    }
  }
});
```

``` javascript
let task = storage.ref('hello').put({
  type: 'string',
  data: 'This is content',
  format: 'raw'
});

task.isRunning // → true

await task;

task.isRunning // → false
task.isCompleted // → true
```

## serialized `→ Object`

Returns json representation of most important `StorageReference` properties.

Useful for debugging.

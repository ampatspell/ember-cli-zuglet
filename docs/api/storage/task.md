---
title: Task
pos: 1
---

# Storage Task

Storage task represents a single file upload.

``` javascript
let task = storage.ref('hello').put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type
  }
});
await task;
task.isCompleted // → true
```

Task is promise-like but also exposes `promise` property. There is no difference which is awaited for.

Promise methods:

* `then(resolve, reject)`
* `catch(err)`
* `finally(fn)`

## type `→ String`

Returns upload file type: `string` or `data`.

## ref `→ StorageReference`

Returns a storage reference associated with this task.

## State properties

* `isRunning` → `Boolean`
* `isCompleted` → `Boollean`
* `isError` → `Boolean`
* `error` → `Error`
* `bytesTransferred` → `Number`
* `totalBytes` → `Number`
* `percent` → `Number`

## promise `→ Promise`

Returns a promise which resolves when file is finished uploading.

## serialized `→ Object`

Returns json representation of most important storage task properties.

Useful for debugging.

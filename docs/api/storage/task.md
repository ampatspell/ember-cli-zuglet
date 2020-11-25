---
title: Task
pos: 1
---

# Task

``` javascript
let ref = this.storage.ref('hello');
let task = ref.put({
  data: file,
  metadata: {
    contentType: file.type
  }
});
```

## state

* isRunning
* isCompleted
* isError
* error

## progress

* progress
* total
* transferred

Task reports progress only when it is activated:

``` javascript
class Upload extends EmberObject {

  @service
  store

  @activate()
  task

  async upload(file) {
    let ref = this.store.storage.ref('hello');
    let task = ref.put({
      data: file,
      metadata: {
        contentType: file.type
      }
    });
    this.task = task;
    await task.promise;
  }

  serialized() {
    let { task: { total, transferred, progress } } = this;
    return {
      total,       // → 1038
      transferred, // → 519
      progress     // → 50
    };
  }

}
```

## metadata

Initial metadata is whatever proided for `ref.put({ metadata })`. When task finishs (`task.isCompleted === true`), metadata is refreshed.

``` javascript
{
  contentType: "text/plain"
}
```

``` javascript
{
  bucket: "<project-id>.appspot.com"
  cacheControl: undefined
  contentDisposition: "inline; filename*=utf-8''hello"
  contentEncoding: "identity"
  contentLanguage: undefined
  contentType: "text/plain"
  customMetadata: undefined
  fullPath: "hello"
  generation: "1605998945217023"
  md5Hash: "8nqpBnIWx8XqWZtAgIQHOA=="
  metageneration: "1"
  name: "hello"
  size: 8
  timeCreated: Date
  type: "file"
  updated: Date
}
```

## promise `→ Promise<Task>`

Resolves when upload is finished.

``` javascript
await task.promise
```

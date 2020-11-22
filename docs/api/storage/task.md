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
  contentType: 'image/png',
  …
}
```

## promise `→ Promise<Task>`

Resolves when upload is finished.

``` javascript
await task.promise
```

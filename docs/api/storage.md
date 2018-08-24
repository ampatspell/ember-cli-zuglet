---
pos: 3
---

# Storage

`Storage` lets you upload files, load and update file metadata and get file public URLs.

``` javascript
let storage = store.storage;
```

## tasks `→ Array<StorageTask>`

Returns an observable array of currently running file upload `StorageTask` instances.

## ref(arg) `→ StorageReference`

Creates a `StorageReference` you can use to upload a file and/or get file metadata or public URL.

* `arg` → `String` or `Object`

If argument is `String`, it is converted to `{ path: arg }`.

Either `path` or `url` is required.

``` javascript
storage.ref('pictures/duck');
storage.ref({ path: 'pictures/duck' })
storage.ref({ url: 'gs://foo/bar' })
```

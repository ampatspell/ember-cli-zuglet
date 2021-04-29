---
title: Reference
pos: 0
---

# Reference


``` javascript
let ref = store.storage.ref('users/zeeba/picture');

let task = ref.put({
  data: file,
  metadata: {
    contentType: file.type,
    customMetadata: {
      // …
    }
  }
});
await task.promise;

let url = await ref.url();
let metadata = await ref.metadata();
```

## name

Name of the file

``` javascript
let ref = store.storage.ref('users/zeeba/picture');
ref.name // → picture
```

## path

Full path of the file

``` javascript
let ref = store.storage.ref('users/zeeba/picture');
ref.path // → users/zeeba/picture
```

## bucket

Google Storage bucket

``` javascript
let ref = store.storage.ref('users/zeeba/picture');
ref.bucket // → <project-id>.appspot.com"
```

## url()

Composes public URL for a file.

``` javascript
let url = await store.storage.ref('hello').url();
url // → https://firebasestorage.googleapis.com/v0/b/<project-id>.appspot.com/o/hello?alt=media&token=…
```

## ref(path) `→ Reference`

Creates a nested reference.

``` javascript
let user = store.storage.ref('users/zeeba');
let picture = user.ref('public/picture');
picture.path // → "users/zeeba/public/picture"
```

## metadata({ optional })

Fetches all file metadata

* `optional` → defaults to false, if true and file doesn't exist, method returns `undefined`

``` javascript
let ref = store.storage.ref('hello');
let metadata = await ref.metadata();
// → {
//   bucket: "<project-id>.appspot.com"
//   cacheControl: undefined
//   contentDisposition: "inline; filename*=utf-8''hello"
//   contentEncoding: "identity"
//   contentLanguage: undefined
//   contentType: "text/plain"
//   customMetadata: undefined
//   fullPath: "hello"
//   generation: "1605998945217023"
//   md5Hash: "8nqpBnIWx8XqWZtAgIQHOA=="
//   metageneration: "1"
//   name: "hello"
//   size: 8
//   timeCreated: Date
//   type: "file"
//   updated: Date
// }
```

## update(metadata)

Updates file metadata.

``` javascript
let ref = store.storage.ref('hello');
await ref.update({
  contentType: 'image/png'
});
```

## delete({ optional }) `→ boolean`

Deletes a file.

* `optional` → defaults to false, if true and file doesn't exist, no errors are thown and method returns false

``` javascript
let ref = store.storage.ref('hello');
let res = await ref.delete({ optional: true });
res // → false
```

## put({ type, format, data, metadata }) `→ Task`

Creates and starts file upload [Task](api/storage/task).

* `type` → `string` or `data` (defaults to `data`)
* `format` → `raw`, `base64`, `base64-url`, `data-url` (only for `{ type: 'string' }`)
* `data` → file data (`string`, `File`, `Blob`…)
* `metadata` → `{ contentType, … }`

``` javascript
let ref = this.storage.ref('hello');
let task = ref.put({
  type: 'string',
  format: 'raw',
  data: 'hey there',
  metadata: {
    contentType: 'text/plain'
  }
});
```

``` javascript
let ref = this.storage.ref('hello');
let task = ref.put({
  data: file,
  metadata: {
    contentType: file.type
  }
});
```

## async list({ maxResults, pageToken }) `→ { items, prefixes, nextPageToken }`

Lists files.

``` javascript
let ref = this.storage.ref('images');
let { items, prefixes, nextPageToken } = await ref.list();
if(nextPageToken) {
  await ref.list({ pageToken: nextPageToken });
}
```

## async listAll() `→ { items, prefixes, nextPageToken }`

Lists all files.

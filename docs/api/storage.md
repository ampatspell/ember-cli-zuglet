---
title: Storage
pos: 4
---

# Storage

`Storage` manages Firebase Storage uploads, urls and metadata.

``` javascript
let storage = store.storage;
```

## bucket

Name of default storage bucket

## ref(path) `→ Reference`

Alias for `ref({ path })`

## ref({ path }) `→ Reference`

Creates a storage reference for path in default bucket.

``` javascript
let ref = store.storage.ref('hello');
ref.path // → hello
ref.bucket // → project-id.appspot.com
```

## ref({ url }) `→ Reference`

Creates a storage reference with `gs://` url.

``` javascript
let ref = store.storage.ref({ url: 'gs://foobar.appspot.com/hello' });
ref.path // → hello
ref.bucket // → foobar.appspot.com
```

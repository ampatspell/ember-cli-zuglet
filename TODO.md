# TODO

* storage: `Use Reference.getDownloadURL instead`
* timestamp update equal should not replace internal
* GeoPoint for data
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* provide identity for queries. identity should also have `doc('id')` and similar

## GeoPoint

``` javascript
let geopoint = store.geopoint(lat, lng);
doc.set('data.location', geopoint);
```

``` javascript
doc.set('data.location', { latitude, longitude });
let geopoint = doc.get('data.location') // GeoPoint
geopoint.getProperties('latitude', 'longitude'); // 24.72504500749274, 58.74554729994484
```

## Storage

* Consider moving load state to reference so that there are no separate states for metadata and url

``` javascript
await ref.metadata.load({ optional: true }) // loads metatada
await ref.url.load({ optional: true }) // gets download url
await ref.load({ url: true, metadata: true, optional: true }); // does 2 identical requests
```

```
reference

  isLoading
  isLoaded
  ...

  metadata
    type
    name
    size
    contentType
    customMetadata
    ...
  url
    value

  parent
  load()
  put()
  child()
task
  ref
  promise

  type (data, string)
  bytesTransferred
  totalBytes
  percent

  isRunning
  isCompleted
  isError
  error
```

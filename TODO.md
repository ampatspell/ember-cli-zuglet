# TODO

* timestamp update equal should not replace internal
* GeoPoint for data
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* batch
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

## Batch

* save (set / update)
* delete
* commit (only if not invoked with cb)

``` javascript
let doc = store.doc('foo/bar').new({ name: 'foo' });
let batch = store.batch();
batch.save(doc);
await batch.commit();
```

``` javascript
await store.batch(async batch => {
  let doc = store.doc('foo/bar').new({ name: 'foo' });
  batch.save(doc);
});
```

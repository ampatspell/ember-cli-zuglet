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

`FullMetadata.downloadURLs` is deprecated

* move metadata load to ref
* mark metadata loaded only if it is actually loaded
* keep url in ref
* also update task snapshot FullMetadata

``` javascript
await ref.metadata.load({ optional: true }) // loads metatada
await ref.load({ url: true, metadata: true, optional: true }); // does 2 identical requests
```

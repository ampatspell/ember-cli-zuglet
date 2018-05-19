# TODO

* simplify `doc.data` internal api
* proper `data.internal.commit()`
* timestamp update equal should not replace internal
* doc.isEditing which makes data updates go to pristine is there is changed properties in data
* GeoPoint for data
* `restoreUser` should be called before sign out
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* transaction
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

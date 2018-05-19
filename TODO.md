# TODO

* `restoreUser` should be called before sign out
* timestamp update equal should not replace internal
* GeoPoint for data
* `save({ merge: true })` for `set(.., { merge: true })`
* data changed properties
* doc.isDirty based on data state
* doc.isEditing which makes data updates go to pristine is there is changed properties in data
* extract `data` part in separate addon
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

## Simplify data api

* `isEditing` proposal goes away
* `pristine` goes away
* have `content.values` (internals) and `content.raw` (json)
* `deserialize` goes to raw
* `serialize` comes from values
* `commit()` takes serialized raw and sets it to raw
* `fetch()` takes raw and creates internals (`rollback` is `fetch`)
* commit after save
* `isDirty` compares each internal to the raw value
* primitives also should have raw

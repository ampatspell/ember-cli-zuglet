# TODO

* unify server-timestamp with timestamp, have model
* GeoPoint for data
* data changed properties
* doc.isDirty based on data state
* doc.isEditing which makes data updates go to pristine is there is changed properties in data
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* transaction
* batch
* provide identity for queries. identity should also have `doc('id')` and similar

## Timestamp

``` javascript
let st = store.serverTimestamp();
doc.set('data.created_at', st);
```

``` javascript
doc.get('data.created_at', new Date());
doc.get('data.created_at') // Timestamp model
```

``` javascript
doc.get('data.created_at', DateTime.local());
doc.get('data.created_at') // Timestamp model
```

``` javascript
let st = doc.get('data.create_at');
st.get('isServerTimestamp'); // true
st.get('isEstimate');        // true
st.get('date');              // null or date
st.get('dateTime');          // luxon from date or null
```

* server timestamp values are immutable

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

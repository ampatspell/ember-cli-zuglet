# TODO

* user `getIdToken` and `getIdTokenResult`
* timestamp update equal should not replace internal
* GeoPoint for data
* messaging, service worker
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
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

## Fastboot

``` javascript
const express = require('express');
const fastbootMiddleware = require('fastboot-express-middleware');

let app = express();

app.use(express.static('../dist', { index: false }));

app.get('/*', fastbootMiddleware('../dist'));

app.listen(3000, () => {
  console.log('FastBoot app listening on port 3000!');
});
```

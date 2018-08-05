# TODO

* query pagination (up & down)
* GeoPoint for data
* fastboot shoebox (?)
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

* manually add all fastboot whitelisted deps to functions package.json
* add fastboot https function
* add rewrite for assets to cdn
* add rewrite for ** => app

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

```
$ PREMBER=true ember s
$ FASTBOOT_DISABLED=true ember s
```

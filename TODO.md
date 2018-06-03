# TODO

* Using `NativeArray#copy` is deprecated
* timestamp update equal should not replace internal
* GeoPoint for data
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* transaction
* batch
* provide identity for queries. identity should also have `doc('id')` and similar
* destroyable computed property similar to route mixin model

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

### Destroyable

* is destroyed when owner is (overrides owner's `willDestroy`)
* is recreated when *hard* dependencies change (also possible to pass just owner)

Inline

* deps
* prepare

Model

* model name or function
* deps
* prepare

``` javascript
import { observed } from 'ember-cli-zuglet/experimental/computed';
import { inline, model } from 'ember-cli-zuglet/model/destroyable';

export default Component.extend({

  source: inline('id', {

    doc: observed(), // set stops observing previous doc

    prepare(owner) {
      this.doc = this.store.doc(`sources/${owner.id}`).existing();
    }

  }),

  source: model('presentation/source', 'id', function(owner) {
    return {
      id: owner.get('id')
    };
  })

});
```

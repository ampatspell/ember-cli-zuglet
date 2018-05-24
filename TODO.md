# TODO

* timestamp update equal should not replace internal
* GeoPoint for data
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* messaging
* transaction
* batch
* provide identity for queries. identity should also have `doc('id')` and similar
* route mixin from index65 (another addon?)
* destroyable computed property similar to route mixin model (another addon?)

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

## Models

Based on index65: https://github.com/ampatspell/index65/blob/master/lib/models/addon/mixins/route.js

* route
* destroyable for components
* model array (?)

### Route models

* does not register in container
* base class implements toString
* models get `routeName` property and based on that models are destroyed on deactivate

``` javascript
import { ModelRoute, model, inline } from 'ember-cli-zuglet/model/route';

export default ModelRoute.extend({

  model: inline(function(route, params) {
    this.sources = route.modelFor('sources');
    this.source = this.sources.sources.content.findBy('id', params.source_id);
    this.collections = this.source.ref.collection('collections').orderBy('name').query({ type: 'array' });
    this.observe(this.collections);
  }),

  model: inline({

    hasSources: gt('sources.content.length', 0),

    collections: observed(),

    prepare(route, params) {
      this.sources = route.modelFor('sources');
      this.source = this.sources.sources.content.findBy('id', params.source_id);
      this.collections = this.source.ref.collection('collections').orderBy('name').query({ type: 'array' });
    }

  }),

  model: model('route/sources/source'), // gets the same `prepare`

});
```

### Destroyable

* is destroyed when owner is (overrides owner's `willDestroy`)
* is recreated when *hard* dependencies change (also possible to pass just owner)

``` javascript
import { model, inline } from 'ember-cli-zuglet/model/destroyable';

export default Component.extend({

  source: inline('id', function(owner) {
    // this.owner = owner;
    this.doc = this.store.doc(`sources/${owner.id}`).existing();
    this.observe(this.doc);
  }),

  source: inline('id', {

    doc: observed(), // set stops observing previous doc

    prepare(owner) {
      // this.owner = owner;
      this.doc = this.store.doc(`sources/${owner.id}`).existing();
    }

  }),

  // differs from all the other api
  // needs separation between owner and model
  source: model('id', function(owner) {
    return {
      name: 'presentation/source',
      prepare(model, owner) {
        model.id = owner.id;
      }
    }
  }),

});
```

---
pos: 2
---

``` javascript
import model from 'ember-cli-zuglet/experimental/model/route';
```

# Route

* inline
* looked up from route name
* provided name

## Inline without mapping

``` javascript
export default Route.extend({

  model: model({

    prepare(route, params) {
    }

  })

});
```

## Inline with mapping

``` javascript
export default Route.extend({

  model: model({

    prepare({ sources, id }) {
    }

  }).mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

## Looked up from route name

``` javascript
export default Route.extend({

  model: model().mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

## Provided name

``` javascript
export default Route.extend({

  model: model('route/source').mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

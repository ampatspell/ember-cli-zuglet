---
pos: 2
---

``` javascript
import { route } from 'ember-cli-zuglet/less-experimental';
```

# Route

## Inline without mapping

``` javascript
export default Route.extend({

  model: route().inline({

    prepare(route, params) {
    }

  })

});
```

## Inline with mapping

``` javascript
export default Route.extend({

  model: route().inline({

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

  model: model().named('route/source').mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

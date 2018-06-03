# Experimental models

* Route
* Destoryable

``` javascript
// import { observed, model, route } from 'ember-cli-zuglet/model';
import { observed, model, route } from 'ember-cli-zuglet/experimental/model';
```

## Route

* inline
* looked up from route name
* provided name

``` javascript
// import { observed, route as model } from 'ember-cli-zuglet/model';
import { observed, route as model } from 'ember-cli-zuglet/experimental/model';
```

### Inline without mapping

``` javascript
export default Route.extend({

  model: model({

    prepare(route, params) {
    }

  })

});
```

### Inline with mapping

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

### Looked up from route name

``` javascript
export default Route.extend({

  model: model().mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

### Provided name

``` javascript
export default Route.extend({

  model: model('route/source').mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

## Destroyable

* inline
* provided name

``` javascript
// import { observed, model } from 'ember-cli-zuglet/model';
import { observed, model } from 'ember-cli-zuglet/experimental/model';
```

## Inline

``` javascript
export default Component.extend({

  model: model('path').inline({

    prepare(owner) {
    }

  })

});
```

## Inline with mapping

``` javascript
export default Component.extend({

  model: model('path', {

    prepare({ path }) {
    }

  }).mapping(owner => ({
    path: owner.path
  }))

});
```

* if mapping returns falsey value, model is not created

## Provided name

``` javascript
export default Component.extend({

  model: model('path', 'document-by-path').mapping(owner => ({
    path: owner.path
  }))

});
```

* mapping is required

## Reusable (inline and provided)

``` javascript
export default Component.extend({

  model: model('path', {

    prepare(owner) {
      // called every time owner.path changes
    }

  }).reusable()

});
```

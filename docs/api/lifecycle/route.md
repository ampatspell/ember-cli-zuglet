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
    },

    async load() {
    }

  })

});
```

## Inline with mixins

``` javascript
import RandomMixin from './-random-mixin';

export default Route.extend({

  model: route().inline(RandomMixin, {

    prepare(route, params) {
    },

    async load() {
    }

  })

});
```

## Inline with mapping

``` javascript
export default Route.extend({

  model: route().inline({

    prepare({ sources, id }) {
      this.setProperties(arguments[0]); // default if prepare() is not provided
    },

    async load() {
    }

  }).mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

## Looked up from route name

``` javascript
// route/sources/source.js
export default Route.extend({

  model: model().mapping((route, params) => ({
    sources: route.modelFor('sources'),
    id: params.source_id
  }))

});
```

``` javascript
// models/route/sources/source.js
export default EmberObject.extend({

  prepare({ sources, id }) {
    this.setProperties(arguments[0]); // default if prepare() is not provided
  },

  async load() {
  }

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

``` javascript
// models/route/sources.js
export default EmberObject.extend({

  prepare({ sources, id }) {
    this.setProperties(arguments[0]); // default if prepare() is not provided
  },

  async load() {
  }

});
```

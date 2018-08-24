---
pos: 3
---

``` javascript
import { model } from 'ember-cli-zuglet/less-experimental';
```

# Model

## Inline

``` javascript
export default Component.extend({

  model: model().owner('path').inline({

    prepare(owner) {
    }

  })

});
```

## Inline with mixins

``` javascript
import RandomMixin from './-random-mixin';

export default Component.extend({

  model: model().owner('path').inline(RandomMixin, {

    prepare(owner) {
    }

  })

});
```

## Inline with mapping

``` javascript
export default Component.extend({

  model: model().owner('path').inline({

    prepare({ path }) {
      this.setProperties(arguments[0]); // default if prepare() is not provided
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

  model: model().owner('path').named('document-by-path').mapping(owner => ({
    path: owner.path
  }))

});
```

## Resolved name

``` javascript
export default Component.extend({

  type: 'book',

  model: model().owner('type', 'path').named(owner => {
    let type = owner.type;
    if(!type) {
      return;
    }
    return `document/${type}`;
  }).mapping(owner => ({ path: owner.path }))

});
```

``` javascript
// models/document/book.ks

export default EmberObject.extend({

  prepare({ path }) {
    this.setProperties(arguments[0]); // default if prepare() is not provided
  }

})
```
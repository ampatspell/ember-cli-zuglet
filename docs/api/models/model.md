---
pos: 3
---

``` javascript
import model from 'ember-cli-zuglet/experimental/model';
```

# Model

* inline
* provided name

## Inline

``` javascript
export default Component.extend({

  model: model('path', {

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

## Resolved name

``` javascript
export default Component.extend({

  type: 'book',

  model: model('type', 'path', owner => {
    let type = owner.type;
    if(!type) {
      return;
    }
    return `document/${type}`;
  }).mapping(owner => ({
    path: owner.path
  }))

});
```

* mapping is required
* doesn't support `reusable()`

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

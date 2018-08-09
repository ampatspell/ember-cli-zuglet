---
pos: 4
---

``` javascript
import models from 'ember-cli-zuglet/experimental/models';
```

# Models

Builds array of models from any object array

## Inline

``` javascript
export default Component.extend({

  query: observed(),

  models: model('query.content', {

    prepare(doc, owner) {
      this.setProperties({ doc });
    }

  })

});
```

## Static model name without mapping

``` javascript
export default Component.extend({

  query: observed(),

  models: model('query.content', 'book')

});
```

``` javascript
// models/book.js
export default EmberObject.extend({
  prepare(doc, owner) {
    this.setProperties({ doc });
  }
})
```

## Static model name with mapping

``` javascript
export default Component.extend({

  query: observed(),

  models: model('query.content', 'book').mapping((doc, owner) => {
    return { doc, owner };
  })

});
```

``` javascript
// models/book.js
export default EmberObject.extend({
  prepare({ doc, owner }) {
    this.setProperties({ doc });
  }
})
```

## Resolved model name without mapping

``` javascript
export default Component.extend({

  query: observed(),

  models: model('query.content', 'data.type', (doc, owner) => {
    let type = doc.data.getProperties('type');
    return `book/${type}`;
  })

});
```

``` javascript
// models/book.js
export default EmberObject.extend({
  prepare(doc) {
    this.setProperties({ doc });
  }
})
```

## Resolved model name with mapping

``` javascript
export default Component.extend({

  query: observed(),

  models: model('query.content', 'data.type', (doc, owner) => {
    let type = doc.data.getProperties('type');
    return `book/${type}`;
  }).mapping((doc, owner) => {
    return { doc, owner };
  });

});
```

``` javascript
// models/book.js
export default EmberObject.extend({
  prepare({ doc, owner }) {
    this.setProperties({ doc });
  }
})
```

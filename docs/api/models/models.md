---
pos: 4
---

``` javascript
import { models } from 'ember-cli-zuglet/less-experimental';
```

# Models

Builds array of models from any object array

## Inline

``` javascript
export default Component.extend({

  query: observed(),

  models: models('query.content').inline({

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

  models: models('query.content').named('book')

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

  models: models('query.content').named('book').mapping((doc, owner) => {
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

  models: models('query.content').object('data.type').named((doc, owner) => {
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

  type: 'book',

  models: model('query.content').owner('type').object('data.type').named((doc, owner) => {
    let doc = doc.data.getProperties('type');
    let owner = owner.type;
    return `${owner}/${type}`;
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

## Models (and possibly rework or `model`, ...)

## All settings

``` javascript
{
  from: {
    deps: {
      owner: [ 'key' ],
    },
    property: owner => owner.key
  },
  array: {
    deps: {
      owner: [ 'type' ],
    },
    name: owner => `posts/${owner.type}`
  },
  model: {
    deps: {
      doc: [ 'type' ],
      owner: [ 'type' ],
    },
    mapping: doc => ({ doc }),
    // body or name
    body: {
      prepare({ doc }, owner) {

      }
    },
    name: (doc, owner) => `posts/${owner.type}/${doc.data.type}`
  }
}
```

## Parent model

``` javascript
export default EmberObject.extend({

  key: 'blog',

  query: observed(),

  prepare() {
    let query = this.store.collection('posts').query();
    this.setProperties({ query });
    return query.observers.promise;
  }

});
```

## Implementations

Models has:

* source
* array setup (name, or resolved name by owner property)
* model setup (name or resolved name by document property)

Types:

* inline, reusable
* inline with mapping, reusable
* provided name (with mapping), reusable
* resolved name (with mapping)

``` javascript
// inline, inline reusable
models('query.content', {
  prepare(doc, owner) {
    this.setProperties({ doc });
  }
}).reusable(),

// inline with mapping, reusable
models('query', {
  prepare({ doc }, owner) {
    this.setProperties({ doc });
  }
}).mapping((doc, owner) => {
  return {
    doc
  };
}).reusable(),

models()
  .from('key', owner => `${owner.key}.content`)
  .from('query')

  .array('type', owner => `posts/${owner.type}`)
  .array('posts/basic')
  .array('type', {
    prepare(owner) {
    }
  }),

  .model({
    owner: [ 'type' ],
    doc: [ 'data.type' ],
    name(doc, owner) {
      return `posts/${owner.type}/${doc.data.type}`;
    },
    mapping(doc, owner) {
      return { doc };
    },
    reusable: true
  })
  .model({
    prepare(doc, owner) {

    }
  })

models()
  .source('query.content')
  .array('posts/basic')
  .model('posts/basic/post')

```

# Notes

`ember-cli-zuglet/less-experimental`

Computed properties:

* models
* model
* route
* observed

Concepts:

* source – models source array dependency
* owner – owner (parent) dependencies which makes model(s) to be recreated
* object – object dependencies which makes models(s) to be recreated
* inline – inline model body
* named – model name lookup
* mapping – owner to model data mapping
* content – observed only, document or query lookup

## Usage

``` javascript
export default EmberObject.extend({

  id: 'yellow',

  // model is recreated on owner.id change
  model: model().owner('id').inline({

    id: null,

    // id observer is unnecessary here as parent model will be recrated
    duck: observed().owner('id').content(owner => {
      let id = owner.id;
      return this.store.doc(`duck/${id}`);
    }),

    // id observer is unnecessary here as parent model will be recrated
    featherDocs: observed().owner('id').content(owner => {
      let id = owner.id;
      return this.store.collection(`duck/${id}/feathers`).query();
    }),

    feathers: models('featherDocs.content').inline({
      prepare(doc) {
        this.setProperties({ doc });
      }
    });

    prepare(id) {
      this.setProperties({ id });
    },

    load() {
      return all([
        this.duck.observers.promise,
        this.featherDocks.observers.promise
      ]);
    }

  })

});
```

``` javascript
let model = parent.model; // model, recreated on id change
await model.load();
model.duck // => observed doc
model.featherDocs.content // => observed docs array
model.feathers // => models for feather docs, created destroyed as docs change
```

## TODO

Observed should support arrays of observable

``` javascript
feathers: observed().owner('duck').content(owner => {
  let ids = owner.duck.data.get('feathers');
  return ids.map(id => this.store.doc(`feathers/${id}`).existing());
  // returns array of documents which needs to be observed
  // all(this.feathers.map(doc => doc.observers.promise)) -- to resolve
}),
```

## Models

``` javascript
models('query.content').owner('product.type').object('data.type').inline({
  prepare(doc, owner) {
  }
});
```

``` javascript
models('query.content').owner('product.type').object('data.type').inline({
  prepare({ doc, product }) {
    this.setProperties({ doc, product });
  }
}).mapping((doc, owner) => {
  let product = owner.product;
  return { doc, product };
});
```

``` javascript
models('query.content').named('book');
```

``` javascript
models('query.content').owner('product.type').object('data.type').named((doc, owner) => {
  let type = doc.get('data.type');
  return `products/${owner.product.type}/components/${type}`;
}).mapping((doc, product) => {
  return { doc, product };
});
```

## Model

``` javascript
model().owner('doc', 'product.type').object('data.type').inline({
  prepare(owner) {
  }
});
```

``` javascript
model().owner('doc', 'product.type').object('data.type').inline({
  prepare({ doc, product }) {
    this.setProperties({ doc, product });
  }
}).mapping(owner => {
  let { doc, product } = owner;
  return { doc, product };
})
```

``` javascript
model().owner('doc').named('book');
```

``` javascript
model().owner('doc', 'product.type').object('data.type').named(({ doc, product }) => {
  let type = doc.get('data.type');
  return `products/${product.type}/components/${type}`;
}).mapping(owner => {
  let { doc, product } = owner;
  return { doc, product };
});
```

## Route model

``` javascript
model().inline({
  prepare(route, params) {
  }
});
```

``` javascript
model().inline({
  prepare({ products, id }) {
  }
}).mapping((route, params) => {
  let id = params.product_id;
  let products = route.modelFor('products');
  return { id, products };
});
```

``` javascript
model().named('book').mapping((route, params) => {
  return {
    prducts: route.modelFor('products'),
    id: params.product_id
  }
});
```

## Observed

``` javascript
observed()
```

``` javascript
observed().content('doc')
```

``` javascript
observed().owner('id').content(owner => this.store.doc(`product/${owner.id}`))
```

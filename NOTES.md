# Notes

`ember-cli-zuglet/less-experimental`

Properties:

* models
* model
* route
* observed

Concepts:

* source – model/models source dependency
* owner – owner (parent) dependencies which makes model(s) to be recreated
* object – object dependencies which makes models(s) to be recreated
* inline – inline model body
* named – model name lookup
* mapping – owner to model data mapping
* content – observed only, document or query lookup

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
model('doc').owner('product.type').object('data.type').inline({
  prepare(doc, owner) {
  }
});
```

``` javascript
model('doc').owner('product.type').object('data.type').inline({
  prepare({ doc, product }) {
    this.setProperties({ doc, product });
  }
}).mapping((doc, owner) => {
  let product = owner.product;
  return { doc, product };
})
```

``` javascript
model('doc').named('book');
```

``` javascript
models('doc').owner('product.type').object('data.type').named((doc, owner) => {
  let type = doc.get('data.type');
  return `products/${owner.product.type}/components/${type}`;
}).mapping((doc, product) => {
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

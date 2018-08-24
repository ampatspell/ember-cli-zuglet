---
pos: 6
---

# Models

Standalone helpers to register and lookup `model:${name}` factories as well as to create model instances.

``` javascript
let models = store.models;
```

## registerFactory(name, factory) `→ undefined`

Registers a `factory` as `model:${name}` in Ember container.

* `name` → `String`
* `factory` → `EmberObject class`

``` javascript
models.registerFactory('duck', EmberObject.extend({ ... }));
let model = models.create('duck', { name: 'yellow' });
// → <foof@model:duck::ember1142>
```

## hasFactoryFor(name) `→ Boolean`

Returns `true` if `model:${name}` is registered.

* `name` → `String`

## factoryFor(name, { optional }) `→ Factory`

Returns a `model:${name}` factory.

* `name` → `String`
* `optional` → `Boolean` (defaults to `false`)

If factory is not registered and optional is:

* `true` → returns undefined
* `false` → throws an assertation `Error`

``` javascript
let factory = models.FactoryFor('duck');
let model = factory.create{ name: 'yellow' });
// → <foof@model:duck::ember1142>
```

## create(name, props) `→ Instance`

Creates an instance.

* `name` → `String`
* `props` → `Object`

Throws an assertation `Error` if factory is not registered.

``` javascript
let factory = models.factoryFor('duck');
let model = factory.create{ name: 'yellow' });
// → <foof@model:duck::ember1142>
```

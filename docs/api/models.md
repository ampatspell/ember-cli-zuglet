---
title: Models
pos: 2
---

# Models

A simple wrapper around Ember's `getOwner(this).getFactory(…)` which works only with `model:…` registrations.

``` javascript
let models = store.models;
```

## create(name, ...args) `→ instance`

Creates a new model instance for given factory name and properties.

### EmberObject

``` javascript
// app/models/message.js
export default class Message extends EmberObject {
}
```

``` javascript
let model = models.create('message', { from: 'larry', to: 'zeeba' });
model.from // → 'larry'
model.to // → 'zeeba'
```

### Plain ES6 Class

``` javascript
// app/models/message.js
import { setOwner } from '@ember/application';

export default class Message {
  constructor(owner, from, to) {
    setOwner(this, owner); // owner → `getOwner(this)`
    this.from = from;
    this.to = to;
  }
}
```

``` javascript
let model = models.create('message', 'larry', 'zeeba');
model.from // → 'larry'
model.to // → 'zeeba'
```

## Plain ZugletObject ES6 class

`ZugletObject` sets owner and overrides `toString()`.

``` javascript
// app/models/message.js
import ZugletObject from 'zuglet/object';

export default class Message {
  constructor(owner, from, to) {
    super(owner);
    this.from = from;
    this.to = to;
  }
}
```

``` javascript
let model = models.create('message', 'larry', 'zeeba');
model.from // → 'larry'
model.to // → 'zeeba'
```

## factoryFor(name, { optional }) `→ factory or undefined`

* `optional` → boolean, defaults to false

Lookups model factory for name.

If `optional` is false and factory is not registered, assertation error is thrown.

## registerFactory(name, factory) `→ undefined`

Registers model factory

---
title: Object
pos: 8
---

# Object

Convinient base class for models which

* sets Ember.js owner to instance so that services can be injected
* overrides `toString()` and registers model name which is not stripped away in production builds

``` javascript
export default class ZugletObject {

  constructor(owner) {
    setOwner(this, owner);
  }

  toString() {
    // …
  }

}
```

Usage

``` javascript
// app/models/duck.js
import ZugletObject from 'zuglet/object';
import { inject as service } from '@ember/service';

export default class Duck extends ZugletObject {

  @service
  store

  constructor(owner, { name }) {
    super(owner);
    this.name = name;
  }

  toStringExtension() {
    return this.name;
  }

}
```

``` javascript
let duck = store.models.create('duck', { name: 'Yellow' });
String(duck) // → <app@model:duck::ember166:Yellow>
duck.store // → <zuglet@store/store::ember108:ember-cli-zuglet>
```

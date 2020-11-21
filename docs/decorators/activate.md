---
title: activate
pos: 3
---

# @activate

Activate decorator activates and deactivates property value based on parent's state.

## @activate().content(fn)

``` javascript
// models/message.js
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { activate } from 'zuglet/decorators';

export default class Message extends EmberObject {

  @service
  store

  @tracked
  id

  @activate().content(({ store, id }) => store.doc(`messages/${id}`).existing())
  doc

}
```

## @activate()

If you don't provide `content()`, `@activate` acts as a writable property which activates set value

``` javascript
// models/message.js
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { activate } from 'zuglet/decorators';

export default class Message extends EmberObject {

  @service
  store

  @activate()
  doc

  update(id) {
    // previous doc value is deactivated
    // new doc value is activated
    this.doc = this.store.doc(`messages/${id}`).existing();
  }

}
```

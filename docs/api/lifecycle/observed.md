---
pos: 0
---

``` javascript
import { observed, observerFor } from 'ember-cli-zuglet/lifecycle';
```

# Observed

`observed` is computed property which observes document or query.

## Writable (static)

``` javascript
// app/models/doc.js

import EmberObject from '@ember/object';
import { observed } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  doc: observed()

});
```

``` javascript
let model = getOwner(this).factoryFor('model:doc').create();
let doc = store.doc('messages/first');

doc.isObserved // => false

model.set('doc', doc);
doc.isObserved // => true

model.destroy(); // or model.set('doc', null);
doc.isObserved // => false
```

## Dynamic

Read only, resolved

``` javascript
// app/models/doc.js

import EmberObject from '@ember/object';
import { observed } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  id: null,

  doc: observed().owner('id').content(owner => {
    let id = owner.id;
    if(!id) {
      return;
    }
    return this.store.doc(`document/${id}`);
  })

});
```

> TODO: `resolveObservers`

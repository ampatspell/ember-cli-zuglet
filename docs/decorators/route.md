---
title: route
pos: 0
---

# @route

`@route` decorator activates route's model while route is active.

``` javascript
// routes/index.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class IndexRoute extends Route {

  @service
  store

  // returned model is activated
  async model() {
    return this.store.doc('messages/first').existing();
  }

  // right after model is activated
  // in this case document has started observing onSnapshot
  // doc.promise resolves when 1st onSnapshot is processed
  async load(doc) {
    await doc.promise;
  }

}

```

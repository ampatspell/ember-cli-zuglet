---
title: root
pos: 1
---

# @root

`@root` activates `@activate`, `@model`, `@models` properties on first access and deactivates when decorated class is destroyed.

It is most useful in `Component` context.

``` javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root, activate } from 'zuglet/decorators';

@root()
export default class NiceComponent extends Component {

  @service
  store

  @tracked
  id

  // doc is created and activated on 1st access from template or component class
  // it is deactivated when component is destroyed
  @activate().content(({ store, id }) => store.doc(`messages/${id}`).existing())
  doc

}
```

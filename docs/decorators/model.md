---
title: model
pos: 4
---

# @model

Model decorator creates model instance with provided name and properties.

``` javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root, model } from 'zuglet/decorators';

@root()
export default class NiceComponent extends Component {

  @service
  store

  @tracked
  type = 'message'

  @tracked
  id

  @model()
    .named(({ type }) => type)
    .mapping(({ store, id }) => ({ store, id }))
    .load(model => model.load()) // optional callback to load inner dependencies on 1st model activation
  model

}
```

``` javascript
// models/message.js
import EmberObject from '@ember/object';
export default class Message extends EmberObject {

  @tracked
  id

  @activate().content(({ store, id }) => store.doc(`messages/${id}`).existing())
  doc

  // optional. invoked if @model().mapping(fn) properties has changed
  // if not provided, model is recreated on mapping changes
  mappingDidChange({ id }) {
    this.id = id;
  }

}
```

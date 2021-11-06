---
title: models
pos: 5
---

# @models

Creates models based on some kind of source array. Useful for wrapping firestore documents in models.

``` javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root, activate, models } from 'zuglet/decorators';
import { action } from '@ember/object';

@root()
export default class MessagesComponent extends Component {

  @service
  store

  // fetches documents and subscribes to query.onSnapshot
  @activate().content(({ store }) => store.collection('messages').query())
  query

  // handles documents in `query.content`
  // creates, updates and removes models based on source
  @models()
    .source(({ query }) => query.content)
    .named(doc => doc.data.type) // if name changes, model is recreated
    .mapping(doc => ({ doc })) // if mapping changes, model.mappingDidChange is invoked or model is recreated
    .load(model => model.load()) // optional callback to load inner dependencies on 1st model activation
  models

  @action
  async add() {
    let ref = this.store.collection('messages').doc();
    let doc = ref.new({
      type: 'message',
      name: 'new message'
    });
    await doc.save();
  }

}
```

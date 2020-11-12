Let's start with a small example. Suppose you want to build an app which let's you have a list of messages. How imaginative. In this wonderful app each message is a document in messages collection and in app you get to have Messages and Message model for your logic.

Also you want to have remotely modified messages beamed to your browser.

Messages needs to be loaded in a particular route, you want to start onserving Firestore's onSnapshot changes when route is activated and stop when person using your app navigates somewhere else in the app.

So far so good. Let's start with a route

``` javascript
// app/routes/messages.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class MessagesRoute extends Route {

  @service
  store

  async model() {
    return this.store.models.create('messages');
  }

  async load(model) {
    await model.load();
  }

}
```

Then let's add `Messages` model:

``` javascript
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { load } from 'zuglet/utils';
import { activate, models } from 'zuglet/decorators';
import { cached } from 'tracked-toolbox';

export default class Messages extends EmberObject {

  @service
  store

  @cached
  get coll() {
    return this.store.collection('messages');
  }

  @activate().content(({ coll }) => coll.orderBy('createdAt', 'desc').query())
  query

  @models().source(({ query }) => query.content).named(() => 'message').mapping(doc => ({ doc }))
  models

  async load() {
    await load(this.query);
  }

  async add(text) {
    let { store, coll } = this;
    let doc = coll.doc().new({
      text,
      createdAt: store.serverTimestamp
    });
    await doc.save();
  }

  byId(id) {
    return this.models.find(model => model.id === id);
  }

}
```

``` javascript
import EmberObject from '@ember/object';
import { read, alias } from 'macro-decorators';

const data = key => alias(`doc.data.${key}`);

export default class Message extends EmberObject {

  doc

  @reads('doc.id')
  id

  @data('createdAt')
  createdAt

  @data('text')
  text

  async save() {
    await this.doc.save();
  }

  async delete() {
    await this.doc.delete();
  }

}
```

``` hbs
{{#each @messages.models as |message|}}
  <div class="message">
    {{message.text}}
  </div>
{{/each}}
```
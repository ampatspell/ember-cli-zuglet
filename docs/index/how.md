Let's look at a not that small example.

Suppose you want to build an app which lets you have a list of messages. In Firestore each message is a document in `messages` collection and in app you want to have `Messages` and `Message` models for logic. Also you want to have remotely modified messages streamed to your browser by using Firestore's `onSnapshot` observer but only when people access `/messages` routes.

So, let's start with a route that creates `messages` model which will be responsible for subscription to `onSnapshot` observer:

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
// app/models/messages.js
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

Each model in `messages.models` array is a `Message` model that encapsulates Firestore document and provides app interface to that.

Let's create that too:

``` javascript
// app/models/message.js
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

And we're done with models.

Render `messages.models` array, do `mesage` property edits, `message.save()`. Everything works as you would expect.

``` hbs
{{#each @messages.models as |message|}}
  <div class="message">
    {{message.text}}
  </div>
{{/each}}
```

Let's look at a not that small example.

Suppose you want to build an app which lets you have a list of messages. In Firestore each message is a document in `messages` collection and in app you want to have `Messages` and `Message` models for logic. Also you want to have remotely modified messages streamed to your browser by using Firestore's `onSnapshot` observer but only when people access `/messages` routes.

So, let's start with a route that creates `messages` model which will be responsible for subscription to `onSnapshot` observer:

``` javascript
// app/routes/messages.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

// this "activates" model while this route is active
// activated documents and queries automatically subscribe to onSnapshot observers
// model trees are built by using @activate, @model, @models decorators
@route()
export default class MessagesRoute extends Route {

  @service
  store

  async model() {
    // create `app/models/message.js` instance
    return this.store.models.create('messages');
  }

  async load(model) {
    // at this point model is activated
    // model.load waits for 1st query onSnapshot event
    await model.load();
  }

}
```

Then let's add `Messages` model:

``` javascript
// app/models/messages.js
import { setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { load } from 'zuglet/utils';
import { activate, models } from 'zuglet/decorators';
import { cached } from 'tracked-toolbox';

export default class Messages {

  @service
  store

  constructor(owner) {
    // or extend from `zuglet/object` which does this and makes toString pretty
    setOwner(this, owner);
  }

  @cached
  get coll() {
    return this.store.collection('messages');
  }

  // creates query on first access and activates it because Messages instance is activated by route
  // activated query subscribes to onSnapshot observer
  @activate().content(({ coll }) => coll.orderBy('createdAt', 'desc').query())
  query

  // creates models for each document and activates it
  // each document here is *not* independently subscribed to onSnapshot
  // because documents are created by query which observers
  @models().source(({ query }) => query.content).named(() => 'message').mapping(doc => ({ doc }))
  models

  async load() {
    // small helper which just awaits this.query.promise
    // which is resolved on 1st query onSnapshot event
    await load(this.query);
  }

  async add(text) {
    let { store, coll } = this;
    // create a new document with generated id and provide some data
    let doc = coll.doc().new({
      text,
      createdAt: store.serverTimestamp
    });
    // save document in Firestore
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
import { setOwner } from '@ember/application';
import { read, alias } from 'macro-decorators';

const data = key => alias(`doc.data.${key}`);

export default class Message {

  doc

  @reads('doc.id')
  id

  @data('createdAt')
  createdAt

  @data('text')
  text

  constructor(owner, { doc }) {
    setOwner(this, owner);
    this.doc = doc; // comes from @models()…mapping(fn)
  }

  async save() {
    // saves document if doc.isDirty
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

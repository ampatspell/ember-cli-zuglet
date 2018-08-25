## Cloud Firestore

* Query, load, save and delete documents
* Document and query change observation
* Supports and encourages to use Firestore local persistence
* Exposes distingtion between document change observation and explicit loading
* Stateful documents

## Save Firestore document

``` javascript
// create new document
let doc = store.doc('messages/first').new();

// set document.data properties
doc.data.setProperties({
  author: 'Kurt Vonnegut',
  text: 'To whom it may concern: It is springtime. It is late afternoon.'
});

// save the document
await doc.save();

// check out the doc
doc.serialized // => { id: 'first', isSaved: true, ..., data: { author ...
```

## Load Firestore document

``` javascript
let doc = await store.doc('message/first').load();
```

## Query Firestore documents

``` javascript
let messages = store.collection('message');
let query = messages.where('author', 'Kurt Vonnegut').query();

await query.load();

query.content // [ doc, ... ]
query.isLoaded // => true
```

## Query single Firestore document

``` javascript
let messages = store.collection('message');
let query = messages.orderBy('created_at', 'desc').query({ type: 'first' });

await query.load();

query.content // doc
```

## Observe Firestore document or query

``` javascript
let doc = store.doc('message/first').existing();
let observer = doc.observe();

doc.data // Ember objects for easy observation

// later
observer.cancel();
```

``` javascript
let query = store.collection('messages').query();
let observer = query.observe();

query.content // => [ doc, ... ]

// later
observer.cancel();
```

## Cloud Storage

* Upload files
* Manage file metadata
* Retrieve file download URLs

## Upload a file to Cloud Storage

``` javascript
let task = store.storage.ref('images/first').put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type,
    customMetadata: {
      originalFilename: file.name
    }
  }
});

await task.promise;

task.percent // => 100
task.isCompleted // => true
```

## Firebase Authentication

* Sign-up users
* Sign-in users
* Retrieve current user
* Load related data on authentication events

``` javascript
let auth = this.store.auth;
await auth.signOut();
```

``` javascript
let auth = this.store.auth;
let email = auth.methods.email;

let user = await email.signUp(props.email, props.password);
```

``` javascript
let auth = this.store.auth;
let email = auth.methods.email;

let user = await email.signIn(props.email, props.password);
```

## Cloud Functions

Lets you call Firebase Cloud Functions.

## Models and Lifecycle Management

Use models in routes and components to encapsulate documents and queries with lifecycle management for change observation.

Models can optionally be declared inline (like in the following example).

``` javascript
import { observed, route } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  // creates inline model which is instantiated on route access,
  // destroyed when app transitions out from this route
  model: route().inline({

    // observe whatver is set to (document or query)
    post: observed(),

    title: readOnly('post.data.title'),
    body:  readOnly('post.data.body'),

    prepare(route, { post_id }) {
      // create a document
      let ref = this.store.collection('posts').doc(post_id);
      let post = ref.existing();

      // set it to `observed` so that it starts observing this document
      this.setProperties({ post });

      // wait for cached or server response
      return post.observers.promise;
    }

  })

});
```

## FastBoot

Supports server-side rendering with FastBoot

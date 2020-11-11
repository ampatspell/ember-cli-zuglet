## Cloud Firestore

* Query, load, save and delete documents
* Attach Document and Query onSnapshot listeners automatically
* Stateful documents

## Save Firestore document

``` javascript
// create new document
let doc = store.doc('messages/first').new();

// set document.data properties
doc.data.author = 'Kurt Vonnegut';
doc.data.text = 'To whom it may concern: It is springtime. It is late afternoon.';

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

``` javascript
let messages = store.collection('message');
let query = messages.orderBy('created_at', 'desc').query({ type: 'first' });

await query.load();

query.content // doc
```

## onSnapshot listeners

TODO

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

TODO

## FastBoot

Server-side rendering with FastBoot is fully supported.
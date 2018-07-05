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

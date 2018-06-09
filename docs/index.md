---
hidden: true
---

``` bash
$ ember install ember-cli-zuglet
```

Provide your firebase config in `app/store.js` and:

## Save your first document

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

## Observe a document or query:

``` javascript
let doc = store.doc('message/first').existing();
let observer = doc.observe();

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

## Upload a file:

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

## Sign-up and sign-in:

``` javascript
let auth = this.store.auth;

if(auth.user) {
  await auth.signOut();
}

let email = auth.methods.email;

let user;
if(signUp) {
  user = await email.signUp(credentials.email, credentials.password);
} else {
  user = await email.signIn(credentials.email, credentials.password);
}
```

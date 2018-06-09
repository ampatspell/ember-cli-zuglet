---
hidden: true
---

``` bash
$ ember install ember-cli-zuglet
```

Provide your firebase config in `app/store.js` and save your first document:

``` javascript
// create new document
let doc = store.doc('messages/first').new();

// set document.data properties
doc.get('data').setProperties({
  author: 'Kurt Vonnegut',
  text: 'To whom it may concern: It is springtime. It is late afternoon.'
});

// save the document
await doc.save();

// check out the doc
doc.serialized
```

Or upload an image:

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
```

Or sign-up and sign-in:

``` javascript
let auth = this.store.auth;

if(auth.user) {
  await auth.signOut();
}

let email = auth.methods.email;
// let user = await email.signUp('ampatspell@gmail.com', 'nice-password');
let user = await email.signIn('ampatspell@gmail.com', 'nice-password');
```

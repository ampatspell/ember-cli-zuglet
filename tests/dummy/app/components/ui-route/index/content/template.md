``` bash
$ ember install ember-cli-zuglet
```

Provide your firebase config in `app/store.js`:

``` javascript
const options = {
  firebase: {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "..."
  },
  firestore: {
    persistenceEnabled: true
  }
};
```

Save your first document:

``` javascript
// create new document
let doc = store.doc('messages/first').new();

// set document.data properties
doc.get('data').setProperties({
  author: 'Kurt Vonnegut',
  text: 'To whom it may concern: It is springtime. It is late afternoon.'
});

// save it document
await doc.save();

// check out the doc
doc.get('serialized');
```

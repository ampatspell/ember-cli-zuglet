---
hidden: true
---

``` bash
$ ember install ember-cli-zuglet
```

Provide your firebase config in `app/store.js`:

``` javascript
const options = {
  firebase: {
    ...
  },
  firestore: {
    persistenceEnabled: true
  }
};
```

And save your first document:

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

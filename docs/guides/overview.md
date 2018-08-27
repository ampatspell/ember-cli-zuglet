---
pos: 0
title: Overview
---

# Overview

`ember-cli-zuglet` is an easiest and most productive way of working with Google Firebase services (Firestore, Storage, Auth and Functions) in Ember.js.

This section describes the general idea behind `ember-cli-zuglet` concepts and how they fit together enabling you to quickly and easily build apps where you are in total control of Firestore Database structure as well as the structure of app itself.

## Store

The central concept in zuglet is the `Store`.

It represents a single Firebase application instance and gives you access to all of it's services. In most cases you'll have one `store` in application but, if necessary, you can have as many as needed.

When you install the addon by using `ember install ember-cli-zuglet` command, it creates a `store` service based on `app/store.js` subclass.

Your `store` subclass is reponsible for:

* Providing a Firebase app configuration
* Handling Ember.js app restore by loading any initially required Firestore documents (optional)
* Handling Firebase Auth state changes and loading any per-user required documents (optional)

``` javascript
import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    // ...
  },
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options,

  // restore() {
  // },

  // restoreUser(user) {
  // }

});
```

> **Note:** If you're planning on using zuglet along with ember-data, make sure you rename zuglet `store` to something else so that the name of the service doesn't clash with ember-data's `store`.

## References

As you may now, Firestore stores data in Documents which are stored in Collections. Also Documents can have nested Collections.

`ember-cli-zuglet` has a concept of Reference, the same way Firebase Firestore SDK has. There are three Reference types: Document, Collection, Query.

References are just a location information, they don't represent actual data stored in the database.

``` javascript
store.collection('ducks').doc();                         // ducks/7glmDmR9ah4SlOXxtrLa (generated id)
store.collection('ducks').doc('yellow');                 // ducks/yellow
store.doc('ducks/yellow');                               // ducks/yellow
```

``` javascript
store.collection('ducks');                               // ducks
store.collection('ducks').where('name', '==', 'yellow'); // ducks query
```

Then you use references to create, load and save documents as well as create queries.

## Refrences & Documents, Queries

This is how you save a Document with id 'yellow' in the `ducks` collection:

``` javascript
let ref = store.doc('ducks/yellow');
let doc = ref.new({ name: 'Yellow' });
await doc.save();
```

And query all the ducks:

``` javascript
let ref = store.collection('ducks');
let query = ref.query();
await query.load();
```

## Observation

What's so special about Firestore is that the service also allows you to observe Documents and Queries to be notified near real-time about changes. This lets you build sophisticated collaboration apps with ease and `ember-cli-zuglet` makes it easy to do so in Ember.js.

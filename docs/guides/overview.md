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

## Refrences & Documents, Queries

While developing appa you mostly deal with the Documents and Queries.

To load, or create a document you need a thing called Reference, which essentialy is a glorified id.

## Observation

what's so special about Firestore is that the service also allows you to observe Documents and Queries to be notified near real-time about changes. This lets you build sophisticated collaboration apps with ease and `ember-cli-zuglet` makes it easy to do so in Ember.js.

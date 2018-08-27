---
pos: 1
hidden: true
---

# Install guide

This page guides you through Ember.js app creation, `ember-cli-zuglet` installation and configuration.

Before we begin, make sure you have latest `ember-cli` installed:

``` bash
$ ember --version
ember-cli: 3.3.0
node: 10.5.0
os: darwin x64
```

While `ember-cli-zuglet` is [known to work](https://travis-ci.org/ampatspell/ember-cli-zuglet) with Ember.js starting from v2.18, it's always a good idea to have a latest ember-cli version installed.

At the time of writing, it's ember-cli 3.3.0.

If you have an outdated ember-cli version, update it by running:

``` bash
$ npm install ember-cli -g
```

## Create a new Ember.js app

Let's start with a new Ember.js app:

``` bash
$ ember new foof
$ cd foof
```

## Remove unnecessary dependencies

Open app's folder in the editor, navigate to `package.json` and remove the following dependencies:

``` diff
   "devDependencies": {
     "broccoli-asset-rev": "^2.7.0",
-    "ember-ajax": "^3.0.0",
     "ember-cli": "~3.3.0",
     "ember-cli-uglify": "^2.0.0",
-    "ember-data": "~3.3.0",
     "ember-export-application-global": "^2.0.0",
     "ember-source": "~3.3.0",
-    "ember-welcome-page": "^3.0.0",
     "eslint-plugin-ember": "^5.0.0",
     ...
```

> **Note:** You can still use ember-data along with ember-cli-zuglet, If you're planning on doing that, you'll need to make a small change later on. I'll note that in the context.

## Install ember-cli-zuglet

Now let's install `ember-cli-zuglet` addon:

``` bash
ember install ember-cli-zuglet
```

This will create the following files in your app:

``` bash
/app/instance-initializers/foof-injections.js
/app/instance-initializers/foof-store.js
/app/routes/application.js
/app/store.js
```

* `foof-store` → Creates and registers basic zuglet `store` service
* `foof-injections` → injects Ember.js Router service into components (nothing to do with ember-cli-zuglet)
* `routes/application` → adds `store.ready` promise to beforeModel hook so that application would wait for store (Firestore local persistence, Auth) to be ready before anything else happens
* `store` → basic Store subclass to provide Firebase configuration and for further extensibility

## Configure store

At this point if you run the app, it will blow up with the following message:

``` html
🔥

No Firebase config provided.
Get your Firebase project configuration from https://console.firebase.google.com/
and paste it in the `app/store.js`
```

Well, that is what we need to do next. Just follow the notes in the message.

If you don't yet have a Firebase project yet, create one and make sure you enable Firestore database with development (allow read & write) security rules so that we could easily save the first document with zuget. Also, while you're at the console, enable Storage too.

Later on, make sure you're [securing your database](https://www.youtube.com/watch?v=oFlHzF5U-HA) and storage properly.

So, copy the `config` properties from "Add Firebase to your app" in the Firebase Console and paste it in the `app/store.js` `config → firebase`:

``` javascript
import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey: "…",
    authDomain: "…",
    databaseURL: "…",
    projectId: "…",
    storageBucket: "…"
  },
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options

});
```

That shold do. Now we can play around with the zuglet.

## Start the app

``` bash
$ ember s
```

And open `http://localhost:4200`

## It's game time

Generated `foof-store.js` sets `window.store` property to the store instance in development environment so that we can play around with the store without having to build routes and components.

Let's create and save a document. Open your browser's console and:

``` javascript
// create a document reference
ref = store.doc('quotes/springtime');

// create a document for that reference
doc = ref.new({
  author: 'Kurt Vonnegut',
  body: 'To whom it may concern: It is springtime. It is late afternoon.'
});

// save document
await doc.save();
```

And check out the document in Firebase Console.

**Note:** If you're getting `"Missing or insufficient permissions"` error, update your Firestore security rules to this for now:

> This makes your database world readable and writable. **Don't** keep it like this. There is a lot of guides, tutorials, videos online on how to write Firestore security rules.

``` javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Ok, now let's load a document:

``` javascript
// create a document reference
ref = store.doc('quotes/springtime');

// load a document
doc = await ref.load();

// check out all the document details by using document's debugging helper
doc.serialized
// →
// {
//   data: {
//     author: "Kurt Vonnegut",
//     body: "To whom it may concern: It is springtime. It is late afternoon."
//   },
//   isLoaded: true,
//   exists: true,
//   ...
// }
```

> **See:** [API Documentation](api) for more information about Documents, Queries, Observation. There is way too much to cover in one guide.

Good, now the Storage. Let's save a file.

As by default Storage security rules requires users to be logged in prior saving any files, navigate to Firebase Console and enable Anonymous sign-in method (it's under Authentication -> Sign-in method tab).

Let's sign-in.

``` javascript
await store.auth.methods.anonymous.signIn();

// check out auth user model if you're curious
store.auth.user.serialized
// →
// {
//   uid: '....',
//   isAnonymous: true,
//   ...
// }
```

Let's upload a file

``` javascript
ref = store.storage.ref('hello');

await ref.put({
  type: 'string',
  format: 'raw',
  data: `Hey there, I'm file.`,
  contentType: 'text/plain',
  metadata: {}
})
```

And get the public url:

``` javascript
ref = store.storage.ref('hello');
await ref.load({ url: true })
ref.url.value
// → "https://firebasestorage.googleapis.com/v0/b/<app-id>.appspot.com/o/hello?alt=media&token=<token>"
```

The same works also for Files and Blobs.

> **See:** [Storage API documentation](api/storage) for more information

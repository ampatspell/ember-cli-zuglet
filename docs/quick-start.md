---
pos: 2
---

# Quick Start

To start using `ember-cli-zuglet`, first we need to create a new ember app. Make sure you have `ember-cli` installed:

``` bash
$ ember --version
ember-cli: 3.0.0
node: 8.9.1
os: darwin x64
```

You need at least Ember.js v2.18 (LTS).

If you don't have ember installed, run:

``` bash
$ npm install ember -g
```

## Create new app

``` bash
$ ember new fluffy
$ cd fluffy
```

## Remove ember-data

This is optional but by-default `ember-cli-zuglet` tries to set `store` service which is used by `ember-data`.

Open `package.json` and remove `ember-data`, `ember-welcome-page`, `ember-ajax`:

``` diff
{
  "name": "fluffy",
  "version": "0.0.0",
  ...
  "devDependencies": {
-    "ember-ajax": "^3.0.0",
-    "ember-data": "~3.0.0",
-    "ember-welcome-page": "^3.0.0",
    ...
  },
  ...
}
```

## Install ember-cli-zuglet

``` bash
$ ember install ember-cli-zuglet
```

Addon creates the following files:

* `app/instance-initializers/fluffy-store.js` -- creates store, injects it as a store service in the application
* `app/routes/application.js` -- adds `store.ready` there so that app boots up with already initialized store and current user info
* `app/store.js` -- default zuglet store where you'll have to provide your firebase configuration
* `app/instance-initializers/fluffy-injections.js` -- injects Ember.js router in components (completely optional, no relation to zuglet)

## Firebase Console

Head to https://console.firebase.google.com/ and create a new project or open existing one.

If you haven't yet, enable Firestore in Firebase Console -- select "Database" → "Get Started" for Cloud Firestore Beta. Start in test mode.

Then select "Project overview" → "Add Firebase to your web app" and copy `config` object.

## Provide configuration

Paste config in the `app/store.js`:

``` javascript
const options = {
  firebase: {
    // right here
  },
  firestore: {
    persistenceEnabled: true
  }
};
...
```

And we're ready to start.

## Start the ember app

``` bash
$ ember s
```

This will start Ember.js development server on port 4200.

## Chrome Console

Open http://127.0.0.1:4200 in chrome and open development tools → console.

You should see `window.store = <fluffy@zuglet:store/store::ember329>` in console.

This is `ember-cli-zuglet` store configured for your Firebase application and exported as a global in development.

## Create a document

Let's start with creating and saving a new document in the console:

``` javascript
ref = store.doc('zuglet/welcome');
doc = ref.new();                  
doc.set('data.message', 'hey there');
await doc.save();                    
```

Let's break it down:

* `store.doc` creates a document reference (like a glorified id)
* `ref.new()` creates a new document model with provided reference
* `doc.set('data....', '...')` sets a property for document
* `doc.save()` saves document in firestore

Check out Database → zuglet → welcome document in Firebase Console.

## Load and update document

``` javascript
ref = await store.doc('zuglet/welcome');
doc = await ref.load();
```

And let's update some properties:

``` javascript
doc.get('data.serialized')
// { message: "hey there" }

doc.get('data').setProperties({
  message: 'Hey, Firestore, how are you today?',
  author: 'zuglet'
});

doc.get('data.serialized');
// { message: "Hey, Firestore, how are you today?", author: "zuglet" }
```

At this point document changes are not yet saved. To do so, we need to `save()` it:

``` javascript
await doc.save();
```

And check out the doc in Firestore Console.

## EOF

While there is quite a lot more APIs available in zuglet, that's it for now. I'll update this doc later on.

Head to Documentation → API to see what's available.

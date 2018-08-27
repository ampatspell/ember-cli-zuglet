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

See [Install Guide](guides/install) to get started.

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

## Documents, Queries

This is how you save a Document with id 'yellow' in the `ducks` collection:

``` javascript
let ref = store.doc('ducks/yellow');
let doc = ref.new({ name: 'Yellow' });
await doc.save();
```

And query all of the documents in `ducks` collection:

``` javascript
let ref = store.collection('ducks');
let query = ref.query();
await query.load();
query.content // → [ Document, ... ]
```

See [Documents and Queries Guide](guides/documents-and-queries) for more information about Documents and Queries.

## Observation

While explicit loading and querying data is sometimes useful, what's so special about Firestore is that the service also lets you observe Documents and Queries.

Let's say you want to know when any of the ducks in collection is added, removed or updated. You just create a query and start observing it. Whenever anything changes in the database, content of the query will be immediately updated:

``` javascript
let query = store.collection('ducks').orderBy('name', 'asc').query();
let observer = query.observe();

query.content // → [ Document, ... ]

observer.cancel();
```

Same goes for separate documents and queries which yield a single document.

## Models

Observation and Firestore local persistence make it quite easy to build highly responsive apps, but if `doc.observe()` API seemed way too low-level or cumbersome to use, you're absolutely right, it is.

This is the reason `ember-cli-zuglet` has one more concept -- models.

Let's see how you would create a `ducks.index` route which loads and automatically starts observing ducks and also stops observing when person using the app navigates out of the route:

``` javascript
// app/routes/ducks/index.js
import { route, observed } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().inline({

    ducks: observed(),

    prepare() {
      let ducks = this.store.collection('ducks').orderBy('name').query();
      this.setProperties({ ducks });
      return ducks.observers.promise;
      // or better yet `return resolveObservers(ducks);` which is essentially the same
    }

  })

});
```

Let's break it down.

**`route()`** will instruct this route to create model when Ember.js will call the model hook. And it will also destroy the model when app transitions out of this route.

**`.inline({})`** will generate an `EmberObject` class from inline hash. You can also create a proper model class in `app/models` folder and reference it here.

**`observed()`** is a computed property-like construct which lets you to set either Document or Query and it starts observing it. If you set another document to it or you destroy the parent EmberObject, it will stop the observation. Together with the fact that route and standalone models are automatically destroyed, this takes care of observation lifecycle.

**`object.observers.promise`** is a convinience property which returns a promise from the first observer and resolves when cached or server data is loaded.

Also there is similar computed property-like model helper for Components which is destroyed on component destroy so that you can automatically observe and stop observing documents and queries in the scope of components:

``` javascript
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({

  id: null, // provided duck id

  duck: model().named('duck').mapping(owner => {
    let { id } = owner;
    return { id };
  })

});
```

``` javascript
// models/duck.js
import { observed } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  id: null,

  doc: observed().owner('id').content(owner => {
    let { id } = owner;
    return this.store.doc(`ducks/${id}`).existing();
  }),

  isLoaded: readOnly('doc.isLoaded'),
  name:     readObly('doc.name'),

  prepare({ id }) {
    this.setProperties({ id });
  }

});
```

Here I'm defining a model which has a proper model class in a separate file (mapping is required so that model is more easily reusable in other contexts). And `observed()` now has `owner()` dependencies and `content()` lookup.

Now we can have a template like this:

``` html
{{#if duck.isLoaded}}
  <div class="name">{{duck.name}}</div>
{{else}}
  <div class="placeholer">Loading…</div>
{{/}}
```

Overall `route`, `model` and `models` used with `observed` is quite enough to easily build large, complicated graphs of models with document and query observers.

See [Models Guide](guides/models) for more information.

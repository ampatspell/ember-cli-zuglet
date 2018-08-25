---
pos: 0
title: Overview
---

# Overview

This section describes the general idea behind `ember-cli-zuglet` concepts and how they fit together enabling you to quickly and easily build apps where you are in total control of Firestore Database structure as well as the structure of app itself.

It is an Ember.js-native way of working with Google Firebase services: Firestore, Storage, Auth and Functions.

## Store

The central concept in zuglet is the `Store`.

It represents a single Firebase application and gives you access to all of the services. In most cases you'll have one `store` but, if necessary, you can have as many as needed.

When you install the addon by using `ember install ember-cli-zuglet` command, it creates a `store` service bases on `app/store.js` subclass.

> **Note:** If you're planning on using zuglet along with ember-data, make sure you rename zuglet `store` to something else so that the name of the service doesn't clash with ember-data's `store`.

In general, store subclass is reponsible for:

* Providing a Firebase app configuration
* Optionally handling Ember.js app restore by loading any initially required Firestore documents
* Optionally handling Firebase Auth state changes and loading any per-user required documents

> **See:** [Install Guide](guides/install) on how to install and configure `ember-cli-zuglet`.

Throughout this guide I'll assume zuglet is configured to be a `store` service and has all the basic setup defaults which includes `window.store` reference accessible from web browser's console (in development environment).

If you're following along with an Ember.js app with the zuglet installed and configured for your Firebase project, try typing `store` in browser's console:

``` bash
> store+''
<dummy@zuglet:store/store::ember913>
```

## Firestore documents and queries

Firebase apps mostly query, load, modify, save and delete Firestore documents. What's so special about Firestore is that the service allows you also to observe document and query result changes in near real-time.

Both, explicit loading and observation, is supported and made very easy in zuglet by provided application lifecycle tools. But let's focus on the basics for a bit.

There are four base concepts which relates to the Firestore in zuglet:

* References
* Document
* Query
* Observer

## References, Documents and Queries

References deals with document and collection locations in Firestore. They also wrap query criteria. Basically you can think of references as a glorified ids.

There are three referece types:

* Document Reference
* Collection Reference
* Query Reference

You can create or load a **Document** based on a document reference or you can create a **Query** based on collection or query reference.

### Document

Let's start with creating a document reference, create a document and save it.

``` javascript
// create a document reference for 'quotes/springtime' document path
let ref = store.doc('quotes/springtime'); // → <dummy@zuglet:reference/document::ember1109:quotes/springtime>

// create a document for that reference
let doc = ref.new({
  author: 'Kurt Vonnegut',
  body: 'To whom it may concern: It is springtime. It is late afternoon.'
});
// → <dummy@zuglet:document::ember1110:quotes/springtime>

// save a document
await doc.save();
```

Now we can also load that document:

``` javascript
// create a document reference for 'quotes/springtime' document path
let ref = store.doc('quotes/springtime'); // → <dummy@zuglet:reference/document::ember1109:quotes/springtime>

// load a single document
let doc = await ref.load(); // → <dummy@zuglet:document::ember1303:quotes/springtime>

// check out document data properties
doc.data.getProperties('author', 'body');
// →
// {
//   author: "Kurt Vonnegut",
//   body: "To whom it may concern: It is springtime. It is late afternoon."
// }
```

> **See:** [Reference](api/store/reference) and [Document](api/store/document) API documentation for more details.

### Query

At this point we have single document in `quotes` collection in Firestore.

Now let's create a query for whole `quotes` collection and load it:

``` javascript
// create a collection reference for 'quotes' collection path
let ref = store.collection('quotes'); // → <dummy@zuglet:reference/collection::ember1129:quotes>

// create a query for that reference
let query = ref.query(); // → <dummy@zuglet:query/array::ember1130:quotes>

// load all documents in that collection
await query.load();

// get number of loaded documents
query.content.length // → 1

// get first loaded document
let doc = query.content.firstObject; // → <dummy@zuglet:document::ember1131:quotes/springtime>

// check out document data properties
doc.data.getProperties('author', 'body');
// →
// {
//   author: "Kurt Vonnegut",
//   body: "To whom it may concern: It is springtime. It is late afternoon."
// }
```

> **See:** [Reference](api/store/reference) and [Query](api/store/query) API documentation for more details.

## Document and query observation

While explicit load and query does it's job, you won't be notified when documents change in the database.

To do that we will use **Observer**.

> **Note:** In most cases you won't need to use observers directly as we will see in the next section, but it might be useful to know how this works under the hood.

Let's just observe the same document we already have:

``` javascript
// create a document based for 'quotes/springtime' document reference
let doc = store.doc('quotes/springtime').existing(); // → <dummy@zuglet:document::ember1509:quotes/springtime>

doc.isLoaded // → false

// create an document observer
let observer = doc.observe(); // → <dummy@zuglet:observer/document::ember1510:quotes/springtime>

doc.isLoaded // → true

// check out document data properties
doc.data.getProperties('author', 'body', 'isFavorite');
// →
// {
//   author: "Kurt Vonnegut",
//   body: "To whom it may concern: It is springtime. It is late afternoon.",
//   isFaviorite: undefined
// }

// at this point, go ahead and modify this document in Firestore Console

// and check out document data properties again
doc.data.getProperties('author', 'body', 'isFavorite');
// →
// {
//   author: "Kurt Vonnegut",
//   body: "To whom it may concern: It is springtime. It is late afternoon.",
//   isFaviorite: true
// }

// stop observing document
observer.cancel();
```

Query observers work the same way. They observe document order changes, additions, removals and individual document modifications.

> **See:** [Observer](api/store/observer), [Document](api/store/document) and [Query](api/store/query) API documentation for more info.

## Application lifecycle management

In general sense it's best to observe documents and queries instead of explicity loading them as it greatly improves application performance and overall user experience.

But to manually create and cancel observers like we did in the previous section is way too much work and quite error prone. It is important to stop observing documents and queries when observation is not needed otherwise observers will pile up and saturate the network bandwidth and the app performance will suffer. It is recommended to have at most around 5 observers at any given time (altrough I haven't seen any real issues with slightly more).

So, to make it easy to observe documents and queries, zuglet has an integrated lifecycle management which provides tools to create and automatically destroy models and `observed` computed property which automatically start and stop document and query observation.

Just to recap, Ember.js has a concept of routes, they are responsible for mapping URLs to pages in the app. In addition to that, they provide `model()` hook which can be used to load any data necessary prior presenting the page to the person viewing it.

Zuglet extends `model()` hook by providing an easy way to create a model class for each route, create a model instance when the route is accessed and to destroy model when app transitions out of the route.

Let's take a basic example of ubiquitous route structure where we have a page which lists all quotes and separate page where we show only one quote:

``` javascript
// app/router.js
Router.map(function() {

  this.route('quotes', function() {
    this.route('quote', { path: ':quote_id' }, function() {
    });
  });

});
```

Let's begin with `quotes.index` which will load all quotes:

``` javascript
// app/routes/quotes/index.js
import { route, observed } from 'ember-cli-zuglet/less-experimental';

export default Route.extend({

  // create an inline (generated) model class for this route
  // instantiated when app transitions into this route
  // destroyed when app transitions out which also stops `observed` property to observe query
  model: route().inline({

    // observes whatever is set. in this case -- quotes query
    quotes: observed(),

    // called in route's `model()` hook
    prepare() {
      let quotes = this.store.collection('quotes').query();
      this.setProperties({ quotes });

      // resolves on either cached or server response
      return quotes.observers.promise;
    }

  })

});
```

And `quotes.quote` which will load just a single quote:

``` javascript
// app/routes/quotes/quote.js
import { route, observed } from 'ember-cli-zuglet/less-experimental';

export default Route.extend({

  model: route().inline({

    quote: observed(),

    prepare(route, { quote_id }) {
      let quote = this.store.collection('quotes').doc(quote_id).existing();
      this.setProperties({ quote });
      return quote.observers.promise;
    }

  })

});
```

Similarly there is `model` computed-property for defining models in components which are destroyed on component destroy.

``` javascript
import { model, observed } from 'ember-cli-zuglet/less-experimental';

export default Component.extend({

  id: null,

  quote: model().owner('id').inline({

    doc: observed(),

    body: readOnly('doc.data.body'),
    author: readOnly('doc.data.author'),

    prepare(owner) {
      let { id } = owner;
      let doc = this.store.doc(`quotes/${id}`).existing();
      this.setProperties({ doc });
    }
  })

});
```

``` html
<div class="body">{{quote.body}}</div>
<div class="author">– {{quote.author}}</div>
```

> **Note:** for `ember-cli-zuglet@1.0` `less-experimental` module will be named `lifecycle`.

> **Note:** Documentation for `lifecycle` here and in API docs are coming soon. See API for more examples.

> **See:** [Lifecycle](api/lifecycle) API documentation for more information

## Auth service

> **Note:** Section comming soon

> **See:** [Auth](api/auth) API documentation

## Storage service

> **Note:** Section comming soon

> **See:** [Storage](api/storage) API documentation

## Functions service

> **Note:** Section comming soon

> **See:** [Functions](api/functions) API documentation

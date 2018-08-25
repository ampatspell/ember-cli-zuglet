---
pos: 0
title: About
---

# About ember-cli-zuglet

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

> **See:** [Getting Started Guide](guides/getting-started) on how to install and configure `ember-cli-zuglet`.

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

// check out data document data properties
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

// check out data document data properties
doc.data.getProperties('author', 'body');
// →
// {
//   author: "Kurt Vonnegut",
//   body: "To whom it may concern: It is springtime. It is late afternoon."
// }
```

> **See:** [Reference](api/store/reference) and [Query](api/store/query) API documentation for more details.

## Document and query observation

## Application lifecycle management

Overall lifecycle management makes it easy to observe and automatically stop observing documents and queries when it is not needed anymore.

## Auth service

## Storage service

## Functions service

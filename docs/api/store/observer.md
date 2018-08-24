---
pos: 3
---

# Observer

Observer wraps an observation subject (document or query), means of getting initial (cached) content and cancellation.

**Note:** Make sure you cancel all observers when they are not needed anymore.

## isCancelled `→ Boolean`

Returns `true` if this observer is cancelled. It doesn't mean that the subject is not being observed by other observer(s).

## content `→ Document | Query`

Observation subject.

## promise `→ Promise`

Returns a `Promise` which resolves on **first** `onSnapshot` invocation. Which means it may resolve with cached data if possible.

For UI performance reasons it is best practice to observe documents and queries and present them when this promise resolves.

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();
await observer.promise;
doc.isLoaded // → true
doc.metadata // → { fromCache: true, … }
```

> TODO: see observed()

## load() `→ Promise`

Function alias for `promise` property.

## cancel() `→ undefined`

Cancels this observer.

# Observers `extends Array`

An array of currently running observers for a Docuemnt or Query

``` javascript
let doc = store.doc('ducks/yellow').existing();
doc.observers // → [ ]

let observer = doc.observe();
doc.observers // → [ observer ]

observer.cancel();
doc.observers // → [ ]
```

## promise `→ Promise`

Returns a `Promise` which, depending on whether current number of observers are:

* zero → does nothing, resolves immediately
* one or more → resolves on first Document or Query snapshot (cached)

``` javascript
let doc = store.doc('ducks/yellow').existing();
let observer = doc.observe();

await doc.observers.promise;

doc.isLoaded // → true
doc.metadata // → { fromCache: true, … }

observer.cancel();
```

> TODO: See observed()

---
title: Callable
---

# Functions Callable

Represents a single callable (`functions.https.onCall`) Firebase Cloud Function.

``` javascript
// firebase/functions/index.js
const functions = require('firebase-functions');
const HttpsError = functions.https.HttpsError;

exports.hello = functions.https.onCall(async (data, context) => {
  let { name } = data;

  if(!name) {
    throw new HttpsError('failed-precondition', 'name is required');
  }

  return {
    message: `Hello ${name}`
  };
});
```

## name `→ String`

Function name

## functions `→ Functions`

Functions instance (region) associated with this callable function.

## call(opts) `→ Promise<Object>`

Calls a Cloud Firestore callable function with `opts`.

Returns a `Promise` which resolves with the function response or rejects with an error.

``` javascript
let callable = functions.callable('hello');
let data = await callable.call({ name: 'duck' });
// →
// {
//   result: {
//     message: 'Hello duck'
//   }
// }
```

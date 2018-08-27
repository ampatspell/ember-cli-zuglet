---
pos: 5
---

## Storage

> **Draft**

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

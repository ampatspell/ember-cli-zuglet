---
title: Anonymous
pos: 2
---

# Anonymous Auth Method

Anonymous auth method lets you sign-in users without any personal details.

Later on it's possible to link anonymous account with any other means of authentication.

## signIn() `→ Promise<AuthUser>`

Returns a `Promise` which resolves with signed-in anonymous `AuthUser`.

At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.anonymous.signIn();
store.auth.user === user // → true
```

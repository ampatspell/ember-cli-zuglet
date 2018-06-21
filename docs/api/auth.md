---
pos: 6
---

# Auth

``` javascript
let auth = this.get('store.auth');

// current user
let user = auth.get('user');

// sign up with email
await auth.get('methods.email').signUp(email, password);

// sign in with email
await auth.get('methods.email').signIn(email, password);

// sign in anonymously
await auth.get('methods.anonymous').signIn();

auth.signOut();
```

---
title: Google
pos: 0
---

# Google

## async signIn(scopes) `→ User`

Sign-in using Google account.

* `scopes` → defaults to `[ 'profile', 'email' ]`

``` javascript
let user = await store.auth.methods.popup.google.signIn();
store.auth.user === user // → true
```

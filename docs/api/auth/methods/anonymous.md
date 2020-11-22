---
title: Anonymous
pos: 0
---

# Anonymous

## async signIn() `→ User`

Sign-in anonymously

``` javascript
let user = await store.auth.methods.anonymous.signIn();
store.auth.user === user // → true
```

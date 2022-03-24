---
title: Token
pos: 2
---

# Token

## async signIn(token) `→ User`

Sign-in with custom token

``` javascript
let user = await store.auth.methods.token.signIn(token);
store.auth.user === user // → true
```

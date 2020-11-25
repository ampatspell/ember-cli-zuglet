---
title: Email
pos: 1
---

# Email

## async signIn(email, password) `→ User`

Sign-in using email and password

``` javascript
let user = await store.auth.methods.email.signIn(email, password);
store.auth.user === user // → true
```

## async signUp(email, password) `→ User`

Sign up with user and password

``` javascript
let user = await store.auth.methods.email.signUp(email, password);
```

## async sendPasswordReset(email, opts) `→ undefined`

``` javascript
await store.auth.methods.email.sendPasswordReset(email);
```

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

## async sendSignInLink(email, opts) `→ undefined`

Sends sign in link to provided email address

``` javascript
await store.auth.methods.email.sendSignInLink(email, {
  url: window.location.href
});
```

## async signInWithLink(email, link) `→ User`

Signs in with a link

* `email` → user's email address
* `link` → optional, defaults to `window.location.href`

``` javascript
let user = await store.auth.methods.email.signInWithLink(email);
```

## async sendPasswordReset(email, opts) `→ undefined`

``` javascript
await store.auth.methods.email.sendPasswordReset(email);
```

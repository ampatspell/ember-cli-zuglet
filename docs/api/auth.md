---
title: Auth
pos: 5
---

# Auth

``` javascript
let auth = store.auth;
```

Auth is activated on first access from store.

## user `→ User or null`

Currently signed in user.

See [Store](api/store) `options.auth` on how to setup custom user subclass.

## promise `→ Promise<User | null>`

Resolves on first `onAuthStateChanged` invocation.

## async signOut() `→ undefined`

Signs out current user if there is current user.

## methods `→ AuthMethods`

Auth [methods](api/auth/methods).

``` javascript
let auth = store.auth;
await auth.methods.anonymous.signIn();
```

## async verifyPasswordResetCode(code) `→ string`

``` javascript
let email = await auth.store.verifyPasswordResetCode(code);
```

## async confirmPasswordReset(code, password) `→ Void`

``` javascript
await auth.store.confirmPasswordReset(code, password);
```

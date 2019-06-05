---
title: Email
pos: 3
---

# Email Auth Method

Email method lets you sign-up and later sign-in users with email address and the password.

## signUp(email, password) `→ Promise<AuthUser>`

Signs-up the user with email and password.

Returns a `Promise` which resolves with newly created `AuthUser` instance. At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.email.signUp('zeeba@gmail.com', 'hello-world');
store.auth.user === user // → true
```

## signIn(email, password) `→ Promise<AuthUser>`

Signs-in existing user with email and password.

Returns a `Promise` which resolves with signed-in `AuthUser` instance. At that point also `store.auth.user` is updated.

``` javascript
let user = await store.auth.methods.email.signIn('zeeba@gmail.com', 'hello-world');
store.auth.user === user // → true
```

## sendPasswordReset(email, opts) `→ Promise<undefined>`

Sends password reset email.

Returns a promise which resolves with `undefined` if email was sent.

``` javascript
try {
  await store.auth.methods.email.sendPasswordReset('zeeba@gmail.com');
} catch(err) {
  console.log(err.code);
}
```

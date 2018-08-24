---
title: User
pos: 2
---

# Auth User

`AuthUser` represents currently signed-in user.

## token({ type, refresh }) `→ Promise<String|Object>`

Returns a `Promise` which is resolved with either encoded or decoded user token.

* `type` → `String`: `string` or `json` (defaults to `string`)
* `refresh` → Boolean (defaults to `false`)

Decoded user token might be useful to get custom user claims.

## delete() `→ Promise`

Returns a `Promise` which is resolved when user is deleted.

## uid `→ String`

Returns user id

## isAnonymous `→ Boolean`

Returns true if anonymous auth method was used to sign-in.

## displayName `→ String`

Returns user's display name if available.

## email `→ String`

Returns user's email if available.

## emailVerified `→ Boolean`

Returns whether user has verified email.

## phoneNumber `→ String`

Returns user's phone number if available.

## photoURL `→ String`

Returns user's photoURL if available.

## providerId `→ String`

Returns authentication provider id.

If anonymous or email auth methods are used, this is `firebase`.

## serialized `→ Object`

Returns json representation of most important user's properties.

Useful for debugging.

``` javascript
console.log(store.auth.user.serialized);
// {
//   uid: '…',
//   isAnonymous: true,
//   displayName: null,
//   email: null,
//   emailVerified: false,
//   phoneNumber: null,
//   photoURL: null,
//   providerId: 'firebase'
// }
```

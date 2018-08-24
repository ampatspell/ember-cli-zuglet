---
pos: 2
---

# Auth

``` javascript
let auth = store.auth;
```

## methods `→ AuthMethods`

``` javascript
let methods = store.auth.methods;
methods.anonymous // → AuthAnonymousMethod
```

## user `→ AuthUser | null`

Returns currently logged-in `AuthUser` instance or null of user is not logged in.

## signOut() `→ Promise`

Signs out currently logged in user.

``` javascript
await store.auth.signOut();
store.auth.user // → null
```

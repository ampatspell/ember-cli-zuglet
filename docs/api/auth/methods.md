---
title: Methods
pos: 1
---

# Auth Methods

Lists and gives access to all available auth methods.

> Note: Currently only Email and Anonymous auth methods are implemented in ember-cli-zuglet

## available `→ Array<String>`

Returns an array of auth method names.

``` javascript
let names = store.auth.methods.available;
let methods = names.map(name => store.auth.methods[name]);
```

## email `→ AuthEmailMethod`

Sign-up and sign-in with email and password.

> TODO: See AuthEmailMethod

## anonymous `→ AuthAnonymousMethod`

Sign-in anonymously.

> TODO: See AuthAnonymousMethod

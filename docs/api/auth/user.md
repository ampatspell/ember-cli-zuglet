---
title: User
pos: 0
---

# User

Currently signed in user.

See [Store](api/store) `options.auth.user` on how to provide custom `User` implementation

## user

Firebase Auth User instance

## props

aliases of `this.user[key]`

* uid
* email
* emailVerified
* photoURL
* displayName
* isAnonymous

## restore(user)

Override to load additional data on user sign-up/sign-in.

``` javascript
import User from 'zuglet/user';
import { load } from 'zuglet/util';

export default class User extends BaseUser {

  @activate().content(({ store, uid }) => store.doc(`users/${uid}`).existing())
  doc

  async restore(user) {
    super.restore(user);
    await load(this.doc);
  }

}
```

## signOut()

Alias of `store.auth.signOut()`

## token({ type, refresh })

Fetch user's token.

* `type` → defaults to `string`. `string` or `json`
* `refresh` → defaults to `false`

``` javascript
let token = store.auth.user.token({ type: 'json' });
```

## link(method, ...args)

Link user accounts.

* `method` → string
* `...args` → arguments forwarded to method's credentials

``` javascript
await store.auth.user.link('email', 'email@address.com', 'heythere')
```

## async updatePassword(newPassword) `→ undefined`

``` javascript
await store.auth.user.updatePassword(newPassword);
```

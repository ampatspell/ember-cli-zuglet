# zuglet@next

``` javascript
"devDependencies": {
  "zuglet": "git+ssh://git@github.com:ampatspell/zuglet-next.git"
}
```

``` javascript
// app/instance-initializers/app-zuglet.js
import { initialize } from 'zuglet/initialize';
import Store from '../store';

export default {
  name: 'app:zuglet',
  initialize(app) {
    initialize(app, {
      store: {
        identifier: 'store',
        factory: Store
      }
    });
  }
}
```

``` javascript
// app/store.js
import Store from 'zuglet/store';

export default class DummyStore extends Store {

  options = {
    firebase: {
      apiKey: "…",
      authDomain: "…",
      databaseURL: "…",
      projectId: "…",
      storageBucket: "…",
      appId: "…"
    },
    firestore: {
      persistenceEnabled: true
    },
    auth: {
      user: 'user'
    },
    functions: {
      region: null
    }
  }

}
```

``` javascript
// app/models/user.js
import User from 'zuglet/user';
import { toPrimitive } from 'zuglet/utils';

export default class DummyUser extends User {

  get serialized() {
    return Object.assign({
      instance: toPrimitive(this)
    }, super.serialized);
  }

}
```

``` javascript
// app/routes/application.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';
import { load } from 'zuglet/utils';

@route()
export default class ApplicationRoute extends Route {

  @service
  store

  async model() {
  }

  async load() {
    await load(this.store.auth);
  }

}
```

``` javascript
// app/routes/index.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class IndexRoute extends Route {

  @service
  store

  async model() {
    return this.store.doc('messages/first').new({
      message: 'To whom it may concern: It is springtime. It is late afternoon.'
    });
  }

  async load(doc) {
    await doc.save();
  }

}
```

## TODO

- [ ] add `doc.save({ token: true })`
- [ ] add something like `observed().content(owner => ....)`
- [ ] add toJSON(), remove objectToJSON serialized handling
- [ ] finalize decorator names
- [ ] Make it work in FastBoot
- [ ] await load/onSnapshot to resolve in FastBoot. Maybe replace onSnapshot with regular loads
- [ ] shoebox support (?)

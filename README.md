# zuglet@next

``` bash
$ ember new foof --skip-npm
```

``` diff
"devDependencies": {
-    "ember-data": "~3.22.0",
+    "zuglet": "git+ssh://git@github.com:ampatspell/zuglet-next.git",
}
```

``` bash
$ npm install
$ ember generate zuglet
```

Open `app/store.js` and add your Firebase config.

## Tweaks

``` javascript
// .template-lintrc.js
'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-index-component-invocation': false
  }
};
```

``` javascript
// jsconfig.json
{
  "compilerOptions": {
    "target": "es6",
    "experimentalDecorators": true
  },
  "exclude": [ "node_modules", ".git" ]
}
```

## Runtime stats

``` hbs
// app/templates/application.hbs
<Zuglet::Stats @stores={{false}}/>
```

## Other addons

``` bash
$ ember install tracked-toolbox
$ ember install macro-decorators
```

## Debugging

``` bash
$ node --inspect-brk ./node_modules/.bin/ember serve
$ chrome://inspect
```

## Decorators

### @route

``` javascript
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class RouteRoute extends Route {

  @service
  store

  // is activated when this returns
  async model() {
    return this.store.models.create('messages');
  }

  // right after model is activated
  // optionally preload data before model() hook resolves
  async load(model) {
    await model.load();
  }

}
```

### @root

``` javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root, activate } from 'zuglet/decorators';

@root() // activates on create and deactivates on willDestroy
export default class RouteDevComponent extends Component {

  @service
  store

  // this is activated on 1st access
  @activate().content(({ store }) = store.doc('messages/first').existing())
  doc

}
```

### @activate

``` javascript
@activate()
  .content(({ store, id }) => store.collection('messages').where('owner', '==', id).query())
```

* if content args changes, content is recreated

### @model

``` javascript
@model()
  .named(({ name }) => name)
  .mapping(({ id }) => ({ id }))
```

* if `modelname` changes, model is recreated
* if `mapping` changes, but `modelName` hasn't changed, `mappingDidChange` is invoked
* if `model.mappindDidChange` doesn't exist, model is recreated
* mapping properties are diffed individually

### @models

``` javascript
@models()
  .source(({ query }) => query.content)
  .named((doc, owner) => `thing/${doc.data.type}`)
  .mapping((doc, owner) => ({ doc }))
```

* if `modelname` changes, model is recreated
* if `mapping` changes, but `modelName` hasn't changed, `mappingDidChange` is invoked
* if `model.mappindDidChange` doesn't exist, model is recreated
* mapping properties are diffed individually

## TODO

- [ ] figure out what's up with textarea
- [ ] maybe also do partial updates for `doc.data.foo = { ok: true }`-type sets
- [ ] add `doc.save({ type: 'update' })`, transaction update, batch update
- [ ] `@route` decorator doesn't deactivate intermediate routes if child route transitions
- [ ] documentation site to replace existing www.ember-cli-zuglet.com
- [ ] add support for cloud messaging

> Test

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

``` bash
$ node --inspect-brk ./node_modules/.bin/ember serve
$ chrome://inspect
```

## Decorators

### @activate

``` javascript
@activate()
  .mapping('id')
  .content(({ store }, { id }) => store.models.create('thing', { id }))
```

* if individual mapping properties hasn't changed, content is not recreated
* if owner props has changed, content is recreated
* there is no `model.mappingDidChange` -- `mapping()` is just to skip content recreation on `@tracked` pings

### @model

``` javascript
@model()
  .named(({ name }) => name)
  .mapping('id')
```

* if mapping changes, but modelName hasn't changed, `mappingDidChange` is invoked

### @models

``` javascript
@models()
  .source(({ query }) => query.content)
  .named((doc, owner) => `thing/${doc.data.type}`)
  .mapping((doc, owner) => ({ doc }))
```

* models doesn't get updated properties at the moment. there is no `mappingDidChange`

## TODO

- [ ] maybe use own `setProperties` for `@tracked` state props or tracking/state
- [ ] `@models` update mapped props with `mappingDidChange`
- [ ] support paths like `@models().source(({ query }) => query.content)` to `@models().source('query.content')`
- [ ] add `doc.save({ type: 'update' })`, transaction update, batch update
- [ ] @route decorator doesn't deactivate intermediate routes if child route transitions
- [ ] documentation site to replace existing www.ember-cli-zuglet.com
- [ ] add support for cloud messaging

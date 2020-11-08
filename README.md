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

## TODO

- [ ] support null `@model` based on `named`
- [ ] `.mapping(({ name }) => ({ name }))` could be `.mapping('name')` for `@activate`, `@model`, `@models`
- [ ] `@models` update mapped props if has changed
- [ ] add `doc.save({ type: 'update' })`, transaction update, batch update
- [ ] @route decorator doesn't deactivate intermediate routes if child route transitions
- [ ] documentation site to replace existing www.ember-cli-zuglet.com
- [ ] add support for cloud messaging

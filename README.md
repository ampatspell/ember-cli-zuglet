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

- [ ] shoebox support with identifiers for docs and queries
- [ ] finalize decorator names
- [ ] @route decorator doesn't deactivate intermediate routes if child route transitions
- [ ] add support for cloud messaging
- [ ] wrap handled firestore errors in ZugletError
- [ ] documentation site to replace existing www.ember-cli-zuglet.com

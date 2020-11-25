# ember-cli-zuglet ![CI](https://github.com/ampatspell/ember-cli-zuglet/workflows/CI/badge.svg)

This addon is dead simple way to use Google Firebase services in your Ember.js apps. Cloud Firestore, Storage, Auth, Functions.

ember-cli-zuglet@^2.0.0 is a complete rewrite for Ember.js Octane.

``` bash
$ ember new foof --skip-npm
```

``` diff
"devDependencies": {
-    "ember-data": "~3.22.0",
}
```

``` bash
$ ember install ember-cli-zuglet
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

## Other useful addons to install

``` bash
$ ember install tracked-toolbox
$ ember install macro-decorators
```

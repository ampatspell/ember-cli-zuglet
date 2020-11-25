# ember-cli-zuglet ![CI](https://github.com/ampatspell/ember-cli-zuglet/workflows/CI/badge.svg)

This addon is dead simple way to use Google Firebase services in your Ember.js apps. Cloud Firestore, Storage, Auth, Functions.

ember-cli-zuglet@^2.0.0 is a complete rewrite for Ember.js Octane.

* [Website](https://www.ember-cli-zuglet.com/)
* [Documentation](https://www.ember-cli-zuglet.com/docs)

Open source apps built using ember-cli-zuglet:

* [kaste](https://github.com/ampatspell/kaste) (v2.x)
* [kaste](https://github.com/ampatspell/dzeja) (v2.x)
* [tiny](http://github.com/ampatspell/tiny) (v1.x)
* [bain ×](https://getbain.com/) (v1.x)
* [index65](https://github.com/ampatspell/index65) (v1.x)
* [ohne-zeit](https://github.com/ampatspell/ohne-zeit) (v1.x)

## Install

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

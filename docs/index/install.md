> ember-cli-zuglet is not yet published on npm

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

and provide your Firebase project configuration in `app/store.js`.

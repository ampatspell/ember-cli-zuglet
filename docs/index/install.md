``` bash
$ ember install ember-cli-zuglet
```

and provide your Firebase project configuration in `app/store.js`.

You might also want to remove `ember-data` from `package.json` and enable experimental decorators in `jsconfig.json`

``` diff
"devDependencies": {
-    "ember-data": "~3.22.0",
}
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

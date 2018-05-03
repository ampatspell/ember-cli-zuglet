# Collection Reference `extends QueryableReference`

``` javascript
let ducks = store.collection('ducks');
let feathers = ducks.doc('yellow').collection('feathers');
let things = store.doc('ducks/yellow').collection('things');
```


## id `→ String`

collection id


## path `→ String`

collection absolute path


## parent `→ DocumentReference`

parent document reference or null


## doc(name) `→ DocumentReference`

creates nested document reference

``` javascript
let doc = store.collection('ducks').doc('yellow');
```

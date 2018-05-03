# Document Reference

``` javascript
let doc = store.doc('ducks/yellow');
let doc = store.collection('ducks').doc('yellow');
```


## id `→ String`

document id


## parent `→ CollectionReference`

document parent collection


## path `→ String`

absolute document path


## collection(name) `→ CollectionReference`

creates nested collection reference

``` javascript
let doc = store.doc('ducks/yellow');
let coll = doc.collection('feathers');
```


## load({ optional }) `→ Promise<Document>`

Loads a document.

If document does not exist:

* `{ optional: false }` → promise is rejected
* `{ optional: true }` → promise is resolved with document which has `{ exists: false }`

``` javascript
let document = await store.doc('ducks/yellow').load();
```


## new() `→ Document`

Builds a new document.

``` javascript
let doc = store.doc('ducks/yellow').new({ name: 'Yellow' });
await doc.save();
```

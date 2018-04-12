# TODO

* data parsing from-to firestore
* primitives for query, load, .. based on destroyable-computed (`{ immediate: true }`)
* auth
* storage
* maybe something which resembles identity -- union of multiple queries as a computed property
* transaction

## Data

``` javascript
let store = this.get('store');
let doc = await store.doc('ducks/yellow').load({ optional: true });
let data = doc.get('data');

data.set('address', { city: 'Riga' });
data.set('address', store.object({ city: 'Riga' }));

data.set('names', [ 'one', 'two' ]);
data.set('names', store.array([ 'one', 'two' ]));

data._internal.serialize('storage / preview');
data._internal.deserialize(json, 'storage'); // diffing
```

* checkpoint on deserialize
* changedProperties
* rollback nested object
* isDirty is based on changedProperties
* deserialize overwrites _or_ keeps changed properties

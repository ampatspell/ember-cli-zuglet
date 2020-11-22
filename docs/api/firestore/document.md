---
title: Document
pos: 1
---

# Document

Document represents a single Firestore document with associated state.

``` javascript
let doc = store.doc('messages/first').existing();
await doc.load();
doc.data.message = 'hey there';
await doc.save();
```

## state

* isNew
* isLoading
* isSaving
* isDirty
* isError
* error
* exists

``` javascript
let doc = await store.doc('messages/first').load();
doc.isNew // → false
doc.isLoaded // → true
doc.isDirty // → false

doc.data.text = 'hello';

doc.isDirty // → true
```

## id

Document id. Alias for `ref.id`.

``` javascript
let doc = store.doc('messages/first').existing();
doc.id // → first
doc.ref.id // → first
```

## path

Document path. Alias for `ref.path`.

``` javascript
let doc = store.doc('messages/first').existing();
doc.path // → messages/first
doc.ref.path // → messages/first
```

## promise `→ Promise<this>`

Resolves when document is loaded either by `doc.load()` or when first `onSnapshot` is processed.

> Note: promise doesn't automatically do a load. You need to activate document using one of decorators for this to work as expected

## token `→ string`

Document static token. See `doc.save({ token: true })` for more info

## data `→ object`

Document data object.

* All object mutations sets `doc.isDirty = true`
* Document reloads and onSnapshot changes trigger property changes only for changed keys.

``` javascript
let doc = await store.doc('messages/first').load();
doc.data // → { message: 'hey there' }
doc.data.message = 'hello';
doc.data = { message: 'hey' };
```

## async load({ force }) `→ this`

* `force` → boolean. defaults to false

Loads document if it is not yet loaded and `isNew` is `false`. If `force` is true, document is always loaded.

``` javascript
let doc = await store.doc('messages/first').existing();
doc.isLoaded // → false
await doc.load();
doc.isLoaded // → true
```

``` javascript
let doc = await store.doc('messages/first').new();
await doc.load();
doc.isLoaded // → false
await doc.load({ force: true });
doc.isLoaded // → true
```

## async reload() `→ this`

Alias for `doc.load({ force: true })`

## async save({ force, merge, token }) `→ this`

Saves document.

* `force`: defaults to `false`. If `force` is `true`, document is saved even if it's not dirty.
* `merge`: defaults to `false`. If `merge` is `true`, document is saved using `set(data, { merge: true })`, otherwise document is saved without `merge`.
* `token`: defaults to `false`. If `token` is `true`, document is saved with `{ _token: doc.token }` property.

``` javascript
let doc = await store.doc('messages/first').existing().load();
await doc.save(); // not dirty, doesn't save
doc.data.message = 'hello';
await doc.save(); // saves
```

### Token

If Firestore document has `_token` property and it is equal to `doc.token`, all `load` and `onSnapshot` data is ignored.

``` javascript
let doc = store.doc('messages/first').new({
  text: 'hey there'
});

await doc.save({ token: true });
await doc.reload(); // doesn't refresh doc.data
```

## async delete() `→ this`

Deletes document.

``` javascript
let doc = await store.doc('messages/first').existing();
await doc.delete();
```

## passive() `→ this`

Makes document not to subscribe to onSnapshot observer. Instead, when document is activated, it is loaded using `doc.load()`

``` javascript
class Model extends EmberObject {

  @activate().content(({ store }) => store.doc('messages/first').existing().passive())
  doc

  async load() {
    await this.doc.promise; // resolves when document is loaded
  }

}
```

## onData `→ cancelFn`

Subscribe to `doc.data` changes from onSnapshot observer.

``` javascript
let doc = await store.doc('messages/first').existing();
let cancel = doc.onData(arg => {
  arg === doc // → true
});

await doc.reload();

cancel();
```

## onDeleted `→ cancelFn`

Subscribe to `doc.exists` changes from onSnapshot observer.

Useful for tracking remotely deleted documents so that app can transition away from deleted documents.

``` javascript
let doc = await store.doc('messages/first').existing();
let cancel = doc.onDeleted(arg => {
  arg === doc // → true
});

await doc.delete();

cancel();
```

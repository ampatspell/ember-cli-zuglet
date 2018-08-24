---
pos: 0
---

# Reference

## isReference `→ true`

Always `true` for all Firestore references.

## id `→ String`

`id` of the document or collection.

``` javascript
let ref = store.doc('ducks/yellow');
ref.id // → 'yellow'
```

``` javascript
let ref = store.collection('ducks/yellow/feathers');
ref.id // → 'feathers'
```

## path `→ String`

Full document or collection `path`

``` javascript
let ref = store.doc('ducks/yellow');
ref.path // → 'ducks/yellow'
```

## parent `→ DocumentReference|CollectionReference|QueryReference`

Returns parent Document, Collection, Query reference or null.

``` javascript
let ref = store.doc('ducks/yellow');
ref.parent // → collection reference for 'ducks'
```

## isEqual(other) `→ Boolean`

Returns true if references are pointing to the same document or collection.

## serialized `→ Array<Object>`

Returns json representation of reference components.

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.serialized
// →
// [
//   { type: 'collection', id: 'ducks' },
//   { type: 'document', id: 'yellow' },
//   { type: 'collection', id: 'feathers' },
//   { type: 'query', id: 'where', args: [ 'color' , '==', 'white' ] }
// ]
```

## string `→ String`

Returns human readable string representation of reference components

Useful for debugging.

``` javascript
let ref = store.collection('ducks/yellow/feathers').where('color', '==', 'white');
ref.string
// → ducks/yellow/feathers.where(color, ==, white)
```

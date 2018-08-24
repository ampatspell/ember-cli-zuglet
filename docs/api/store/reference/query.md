---
pos: 2
title: Query
---

# Query Reference `extends Queryable`

## type `→ String`

Condition `type`.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.type // → 'where'
```

## args `→ Array<Any>`

Condition arguments.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.args // → [ 'name', '==', 'yellow' ]
```

## parent `→ QueryReference|CollectionReference`

Returns a parent reference.

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow');
ref.parent // → collection reference for 'ducks'
```

``` javascript
let ref = store.collection('ducks').where('name', '==', 'yellow').limit(100);
ref.parent // → queryable reference for collection 'ducks' with where condition
```

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

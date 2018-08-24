---
pos: 4
---

# Functions

Represents a Firebase Cloud functions region.

``` javascript
let functions = store.function();
await functions.callable('hello-world').call({ });
```

## region `→ String | null`

Returns a name of the region

## callable(name) `→ FunctionsCallable`

Creates a callable instance for the name.

---
title: Lifecycle
pos: 5
---

# Lifecycle Management

Addon contains tools which allows you to easily create models that manages lifecycle of document and query observers in the scope of routes and components.

``` javascript
import {
  route,
  model,
  models,
  observed,
  observerFor,
  resolveObservers
} from 'ember-cli-zuglet/lifecycle';
```

```
## Observed

* also `resolveObservers`

### observed()

### owner(...args)
### content(arg)

## Route

### route()
### inline(...args)
### named(arg)
### mapping(arg)

## Model

### model()
### owner(...args)
### inline(...args)
### named(arg)
### mapping(arg)

## Models

### models(arg)
### source(arg)
### owner(...args)
### object(...args)
### inline(...args)
### named(arg)
### mapping(arg)
```

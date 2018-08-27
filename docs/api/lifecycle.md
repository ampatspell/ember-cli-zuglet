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

## Modules

* [Route](api/lifecycle/route) – define route models
* [Model](api/lifecycle/model) – define models in components and nsested models
* [Models](api/lifecycle/models) – define array of models based on another array (`query.content` for example)
* [Observed](api/lifecycle/observed) – automatically observe a document or query

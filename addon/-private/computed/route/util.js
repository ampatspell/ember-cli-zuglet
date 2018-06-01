import { getOwner } from '@ember/application';
import { get } from '@ember/object';
import { resolve } from 'rsvp';
import { findOrCreateModelFactory } from './factory';

export const createModel = (route, params, arg) => {
  let owner = getOwner(route);
  let routeName = route.routeName;
  let factory = findOrCreateModelFactory(owner, routeName, arg)
  return factory.create({
    _internal: {
      routeName
    }
  });
}

export const loadModel = (model, args) => {
  return resolve(model.prepare && model.prepare(...args)).then(() => model);
}

export const isModelForRouteName = (model, routeName) => {
  return model && get(model, '_internal.routeName') === routeName;
}

export const resetController = function() {
  let model = this.currentModel;
  if(!model) {
    return;
  }
  if(!isModelForRouteName(model, this.routeName)) {
    return;
  }
  model.destroy();
}

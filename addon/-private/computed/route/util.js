import { get } from '@ember/object';
import { resolve } from 'rsvp';
import { findOrCreateModelFactory } from './factory';

export const createModel = (route, params, arg) => {
  let factory = findOrCreateModelFactory(route, arg)
  let routeName = route.routeName;
  return factory.create({
    _internal: {
      routeName
    }
  });
}

export const loadModel = (model, route, params) => {
  return resolve(model.prepare && model.prepare(route, params)).then(() => model);
}

export const createLoadedModel = (route, params, arg) => {
  let model = createModel(route, params, arg);
  return loadModel(model, route, params);
}

export const isModelForRouteName = (model, routeName) => {
  return model && get(model, '_internal.routeName') === routeName;
}

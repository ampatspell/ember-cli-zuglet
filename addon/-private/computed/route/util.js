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

export const loadModel = (model, opts) => {
  return resolve(model.prepare && model.prepare(opts)).then(() => model);
}

export const isModelForRouteName = (model, routeName) => {
  return model && get(model, '_internal.routeName') === routeName;
}

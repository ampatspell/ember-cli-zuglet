import EmberObject from '@ember/object';
import { getOwner } from '@ember/application'
import { resolve } from 'rsvp';

const modelFactoryNameForRouteName = routeName => `model:route/${routeName.replace(/\./g, '/')}`;

const createModelFactory = (arg, routeName) => {
  let factory;

  if(typeof arg === 'function') {
    factory = EmberObject.extend({
      prepare() {
        return arg.call(this, ...arguments);
      }
    });
  } else {
    factory = EmberObject.extend(arg);
  }

  return factory.reopenClass({
    isRouteModel: true,
    routeName
  });
}

const findOrCreateModelFactory = (route, arg) => {
  let owner = getOwner(route);
  let routeName = route.routeName;
  let fullName = modelFactoryNameForRouteName(routeName);
  let factory = owner.factoryFor(fullName);
  if(!factory) {
    owner.register(fullName, createModelFactory(arg, routeName));
    factory = owner.factoryFor(fullName);
  }
  return factory;
}

export const createModel = (route, params, arg) => {
  let factory = findOrCreateModelFactory(route, arg);
  let model = factory.create();
  return model;
}

export const createLoadedModel = (route, params, arg) => {
  let model = createModel(route, params, arg);
  return resolve(model.prepare && model.prepare()).then(() => model);
}

import { get } from '@ember/object';
import { resolve } from 'rsvp';
import { assert } from '@ember/debug';

export const isInstance = (model, routeName) => {
  return model && get(model, '_internal.routeName') === routeName;
}

export const createInstance = (factory, routeName) => {
  let _internal = { routeName };
  return factory.create({ _internal });
}

const argumentsForPrepare = (route, params, mapping, requireMapping) => {
  if(typeof mapping === 'function') {
    let hash = mapping.call(route, route, params);
    return [ hash ];
  }
  assert(`route models which are not created inline requires mapping`, !requireMapping);
  return [ route, params ];
}

const prepareInstance = (instance, args) => resolve().then(() => {
  return instance.prepare && instance.prepare(...args);
}).then(() => instance);

export const loadInstance = (instance, route, params, mapping, requireMapping) => {
  let args = argumentsForPrepare(route, params, mapping, requireMapping);
  return prepareInstance(instance, args);
}

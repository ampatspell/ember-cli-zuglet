import { getOwner } from '@ember/application';

const marker = Symbol('ZUGLET');

const createState = owner => {
  let factory;
  if(isRoot(owner)) {
    factory = getOwner(owner).factoryFor('zuglet:state/root');
  } else {
    factory = getOwner(owner).factoryFor('zuglet:state/model');
  }
  return factory.create({ owner });
}

export const getState = (owner, create=true) => {
  if(!owner) {
    return;
  }

  let state = owner[marker];
  if(!state && create) {
    state = createState(owner);
    owner[marker] = state;
  }

  return state;
}

const root = 'root';

export const isRoot = instance => {
  return instance && instance.constructor[marker] === root;
}

export const setRoot = Class => {
  Class[marker] = root;
}

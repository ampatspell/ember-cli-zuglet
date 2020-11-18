import { getOwner } from '../../util/get-owner';
import { assert } from '@ember/debug';

const marker = Symbol('ZUGLET');

const createState = owner => {
  let _owner = getOwner(owner);
  let factory;
  if(isRoot(owner)) {
    factory = _owner.factoryFor('zuglet:state/root');
  } else {
    factory = _owner.factoryFor('zuglet:state/model');
  }

  return factory.create({ owner });
}

export const getState = (owner, create=true) => {
  assert(`owner is required`, !!owner);

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

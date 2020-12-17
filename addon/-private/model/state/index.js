import { getOwner } from '../../util/get-owner';
import { assert } from '@ember/debug';

const {
  assign
} = Object;

const marker = Symbol('ZUGLET');

const createState = (owner, opts) => {
  let _owner = getOwner(owner, opts);
  if(!_owner) {
    return;
  }
  let factory;
  if(isRoot(owner)) {
    factory = _owner.factoryFor('zuglet:state/root');
  } else {
    factory = _owner.factoryFor('zuglet:state/model');
  }

  return new factory.class(_owner, { owner });
};

export const getState = (owner, opts) => {
  let { optional, create } = assign({ optional: false, create: true }, opts);
  assert(`owner is required`, !!owner);

  let state = owner[marker];
  if(!state && create) {
    state = createState(owner, { optional });
    owner[marker] = state;
  }

  return state;
};

const root = 'root';

export const isRoot = instance => {
  return instance && instance.constructor[marker] === root;
};

export const setRoot = Class => {
  Class[marker] = root;
};

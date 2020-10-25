import { getOwner } from '@ember/application';
import { isRoot } from '../root';

const _state = Symbol('ZUGLET');

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

  let state = owner[_state];
  if(!state && create) {
    state = createState(owner);
    owner[_state] = state;
  }

  return state;
}

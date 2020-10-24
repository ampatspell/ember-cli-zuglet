import { getOwner } from '@ember/application';

const _state = Symbol('ZUGLET');

const createState = owner => {
  return getOwner(owner).factoryFor('zuglet:state').create({ owner });
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

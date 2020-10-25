import { getOwner } from '@ember/application';
import { isModel } from '../model';

const _state = Symbol('ZUGLET');

const createState = owner => {
  let factory;
  if(isModel(owner)) {
    factory = getOwner(owner).factoryFor('zuglet:state/model');
  } else {
    factory = getOwner(owner).factoryFor('zuglet:state/root');
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

import { getState } from '../../state';

export const getProperty = (owner, key) => {
  let state = getState(owner);
  return state && state.getProperty(key);
}

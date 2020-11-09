import { getState } from '../model/state';

class Activator {
  toString() {
    return `<utils::activate>`;
  }
}

let activator = new Activator();

export const activate = model => {
  let state = getState(model);
  state.activate(activator);
  return () => {
    state.deactivate(activator);
  }
}

export const isActivated = model => getState(model).isActivated;

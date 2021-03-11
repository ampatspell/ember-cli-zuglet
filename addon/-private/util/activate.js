import { getState } from '../model/state';

class Activator {
  toString() {
    return `<Activator>`;
  }
}

let _activator = new Activator();

export const activate = (model, activator=_activator) => {
  let state = getState(model);
  state.activate(activator);
  return () => {
    state.deactivate(activator);
  }
};

export const isActivated = model => getState(model).isActivated;

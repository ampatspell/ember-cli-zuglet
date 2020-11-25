import { activate } from '../properties/activate';
import { getState } from '../state';
import { isFunction } from '../../util/object-to-json';
import { registerPromise } from '../../stores/stats';

const activateRoute = route => {
  if(!route.isActivated) {
    route.isActivated = true;
    getState(route).activate(route);
  }
}

const deactivateRoute = route => {
  if(route.isActivated) {
    route.isActivated = false;
    getState(route).deactivate(route);
  }
  route.active = null;
}

const extend = Class => class ActivatingRoute extends Class {

  @activate()
  active

  isActivated = false;

  async model(_, transition) {
    activateRoute(this);
    try {
      let model = await super.model(...arguments);
      this.active = model;
      if(!transition.isAborted && isFunction(this.load)) {
        await registerPromise(this, 'load', this.load(model));
      }
      if(transition.isAborted) {
        deactivateRoute(this);
      }
      return model;
    } catch(err) {
      deactivateRoute(this);
      throw err;
    }
  }

  resetController(_, isExiting) {
    if(isExiting) {
      deactivateRoute(this);
    }
    return super.resetController(...arguments);
  }

}

export const route = () => Class => extend(Class);

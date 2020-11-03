import { activate } from '../properties/activate';
import { getState } from '../state';
import { isFunction } from '../../util/object-to-json';

const activateRoute = route => {
  if(!route.isActivated) {
    getState(route).activate(route);
    route.isActivated = true;
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

  async model(params, transition) {
    activateRoute(this);
    try {
      let model = await super.model(...arguments);
      this.active = model;
      if(isFunction(this.load)) {
        await this.load(model);
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

  resetController(controller, isExiting) {
    if(isExiting) {
      deactivateRoute(this);
    }
    return super.resetController(...arguments);
  }

}

export const route = () => Class => extend(Class);

import { activate } from '../properties/activate';
import { getState } from '../state';
import { isFunction } from '../../util/types';
import { registerPromise } from '../../stores/stats';
import type Route from '@ember/routing/route';

const activateRoute = (route: any): void => {
  if(!route.isActivated) {
    route.isActivated = true;
    getState(route).activate(route);
  }
};

const deactivateRoute = (route: any): void => {
  if(route.isActivated) {
    route.isActivated = false;
    getState(route).deactivate(route);
  }
  route.active = null;
};

const extend = (Class: any): any => class ActivatingRoute extends Class {

  @activate()
  active: any

  isActivated = false;

  async model(_: any, transition: any): Promise<any> {
    activateRoute(this);
    try {
      const model = await super.model(...arguments);
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

  resetController(_: any, isExiting: boolean): any {
    if(isExiting) {
      deactivateRoute(this);
    }
    return super.resetController(...arguments);
  }

};

export const route = () => <T extends typeof Route> (Class: T): T => extend(Class);

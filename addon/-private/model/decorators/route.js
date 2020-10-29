import { activate } from '../properties/activate';
import { getState } from '../state';
import { isFunction } from '../../util/object-to-json';

const extend = Class => class ActivatingRoute extends Class {

  @activate()
  active

  isActivated = false;

  async model() {
    if(!this.isActivated) {
      getState(this).activate(this);
      this.isActivated = true;
    }
    let model = await super.model(...arguments);
    this.active = model;
    if(isFunction(this.load)) {
      await this.load(model);
    }
    return model;
  }

  resetController() {
    if(this.isActivated) {
      this.isActivated = false;
      getState(this).deactivate(this);
    }
    this.active = null;
    return super.resetController(...arguments);
  }

}

export const route = () => Class => extend(Class);

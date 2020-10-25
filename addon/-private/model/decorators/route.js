import { activate } from '../properties/activate';
import { getState } from '../state';
import { isFunction } from '../../util/object-to-json';

const extend = Class => class ActivatingRoute extends Class {

  @activate()
  active

  beforeModel() {
    getState(this).activate(this);
    return super.beforeModel(...arguments);
  }

  async model() {
    let model = await super.model(...arguments);
    this.active = model;
    if(isFunction(this.load)) {
      await this.load(model);
    }
    return model;
  }

  resetController() {
    getState(this).deactivate(this);
    this.active = null;
    return super.resetController(...arguments);
  }

}

export const route = () => Class => extend(Class);

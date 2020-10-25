import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';

export default class Stats extends EmberObject {

  activated = A();

  registerActivated(model) {
    this.activated.pushObject(model);
  }

  unregisterActivated(model) {
    this.activated.removeObject(model);
  }

}

export const getStats = owner => {
  return getOwner(owner).lookup('zuglet:stats');
}

export const registerActivated = model => getStats(model).registerActivated(model);
export const unregisterActivated = model => getStats(model).unregisterActivated(model);

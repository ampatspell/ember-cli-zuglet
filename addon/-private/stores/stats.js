import EmberObject from '@ember/object';
import { getStores } from './get-stores';
import { A } from '@ember/array';

export const getStats = owner => getStores(owner).stats;

export const registerActivated = model => getStats(model).registerActivated(model);
export const unregisterActivated = model => getStats(model).unregisterActivated(model);

export default class Stats extends EmberObject {

  activated = A();

  registerActivated(model) {
    this.activated.pushObject(model);
  }

  unregisterActivated(model) {
    this.activated.removeObject(model);
  }

}

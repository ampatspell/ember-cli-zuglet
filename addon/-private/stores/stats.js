import EmberObject from '@ember/object';
import { getStores } from './get-stores';
import { A } from '@ember/array';

export default class Stats extends EmberObject {

  activated = A();
  snapshots = A();

  _registerActivated(model) {
    this.activated.pushObject(model);
  }

  _unregisterActivated(model) {
    this.activated.removeObject(model);
  }

  _registerOnSnapshot(model) {
    this.snapshots.pushObject(model);
    return () => this.snapshots.removeObject(model);
  }

}

export const getStats = owner => getStores(owner).stats;

export const registerActivated = model => getStats(model)._registerActivated(model);
export const unregisterActivated = model => getStats(model)._unregisterActivated(model);

export const registerOnSnapshot = (model, cancel) => {
  let snapshot = getStats(model)._registerOnSnapshot(model);
  return () => {
    snapshot();
    cancel();
  };
}

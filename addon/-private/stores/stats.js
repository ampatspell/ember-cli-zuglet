import EmberObject from '@ember/object';
import { getStores } from './get-stores';
import { A } from '@ember/array';
import { isPromise } from '../util/object-to-json';
import { next } from '../util/runloop';

export default class Stats extends EmberObject {

  activated = A();
  snapshots = A();
  promises = A();

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

  _registerPromise(model, label, promise) {
    if(isPromise(promise)) {
      promise.stats = { model, label };
      this.promises.pushObject(promise);
      let done = () => this.promises.removeObject(promise);
      promise.then(done, done);
    }
    return promise;
  }

  get hasPromises() {
    return this.promises.length > 0;
  }

  async settle() {
    await next();
    let promises = this.promises;
    if(promises.length === 0) {
      return;
    }
    await Promise.all(promises).then(() => {}, () => {});
    this.settle();
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

export const registerPromise = (model, label, promise) => getStats(model)._registerPromise(model, label, promise);

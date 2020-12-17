import ZugletObject from '../object';
import { getStores } from './get-stores';
import { A } from '@ember/array';
import { isPromise } from '../util/types';
import { next } from '../util/runloop';

export default class Stats extends ZugletObject {

  activated = A();
  observers = A();
  promises = A();

  _registerActivated(model) {
    this.activated.pushObject(model);
  }

  _unregisterActivated(model) {
    this.activated.removeObject(model);
  }

  _registerObserver(model) {
    this.observers.pushObject(model);
    return () => this.observers.removeObject(model);
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

  get hasObservers() {
    return this.observers.length > 0;
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

export const registerObserver = (model, cancel) => {
  let observer = getStats(model)._registerObserver(model);
  return () => {
    observer();
    cancel();
  };
};

export const registerPromise = (model, label, promise) => getStats(model)._registerPromise(model, label, promise);

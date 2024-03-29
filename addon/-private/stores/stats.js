import ZugletObject from '../object';
import { getStores } from './get-stores';
import { A } from '@ember/array';
import { isFunction, isPromise } from '../util/types';
import { next } from '../util/runloop';
import { join } from '@ember/runloop';
import { assert } from '@ember/debug';
import flags from 'zuglet/-private/flags';

const { stallThreshold } = flags;

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

  _wrapPromise(promise) {
    let result = new Promise((resolve, reject) => {
      promise.then(result => {
        join(null, resolve, result);
      }, err => {
        join(null, reject, err);
      });
    });
    return result;
  }

  _registerPromise(model, label, track, promise) {
    assert(`model is required`, !!model);
    assert(`label must be string`, typeof label === 'string');
    assert(`track must be boolean`, typeof track === 'boolean');
    if(isPromise(promise)) {
      promise = this._wrapPromise(promise);
      let start = null;
      if(track) {
        start = new Date();
      }
      promise.stats = { model, label, start };
      this.promises.pushObject(promise);
      let done = () => this.promises.removeObject(promise);
      promise.then(done, done);
    }
    return promise;
  }

  get stalledPromises() {
    let now = new Date();
    return this.promises.filter(promise => {
      let { stats: { start } } = promise;
      if(!start) {
        return false;
      }
      return now - start > stallThreshold;
    });
  }

  get hasStalledPromises() {
    return this.stalledPromises.length > 0;
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

export const registerObserver = (model, fn) => {
  assert('model is required', model);
  assert(`fn must be function not '${fn}'`, isFunction(fn));
  let observer = getStats(model)._registerObserver(model);
  let wrap = fn => (...args) => join(null, fn, ...args);
  let cancel = fn(wrap);
  assert(`cancel must be function not '${cancel}'`, isFunction(cancel));
  return () => {
    observer();
    cancel();
  };
}

export const registerPromise = (model, label, track, promise) => getStats(model)._registerPromise(model, label, track, promise);

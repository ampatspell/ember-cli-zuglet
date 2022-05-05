import { deprecate } from '@ember/debug';
import { registerPromise } from '../stores/stats';
import { cancelledError } from './error';

export const defer = () => {
  let resolve;
  let reject;
  let promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
};

class CachedRemoteDefer {

  constructor(arg, track) {
    this._owner = arg;
    this._cached = defer();
    this._remote = defer();
    this._track = track;
    if(track) {
      registerPromise(arg, 'snapshot', true, this._remote.promise);
    }
  }

  _settle(name, type, arg) {
    let settle = prop => {
      let deferred = this[`_${prop}`];
      deferred[name].call(deferred, arg);
    }
    if(type === 'cached') {
      settle('cached');
    } else if(type === 'remote') {
      settle('cached');
      settle('remote');
    }
  }

  get cached() {
    return this._cached.promise;
  }

  get remote() {
    return this._remote.promise;
  }

  resolve(type, arg) {
    this._settle('resolve', type, arg);
  }

  reject(type, arg) {
    this._settle('reject', type, arg);
  }

  //

  _deprecate(name) {
    deprecate(`deferred.${name} is deprecated for ${this._owner}. use deferred.{cached,remote}.${name} instead`, false, { id: 'deferred', for: 'zuglet' ,since:'2.4.37', until: '2.6' });
  }

  get promise() {
    this._deprecate('promise');
    return this.cached;
  }

  then(...args) {
    this._deprecate('then');
    return this.cached.then(...args);
  }

  catch(...args) {
    this._deprecate('catch');
    return this.cached.catch(...args);
  }

  finally(...args) {
    this._deprecate('finally');
    return this.cached.finally(...args);
  }

}

export const cachedRemoteDefer = (owner, track) => new CachedRemoteDefer(owner, track);

export const replaceCachedRemoteDefer = (owner, key, track) => {
  let existing = owner[key];
  if(existing && existing._track) {
    existing.reject('remote', cancelledError());
  }
  let deferred = cachedRemoteDefer(owner, track);
  owner[key] = deferred;
};

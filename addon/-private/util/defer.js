import { deprecate } from '@ember/debug';

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

  constructor() {
    this._cached = defer();
    this._remote = defer();
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

  _deprecate(name) {
    deprecate(`deferred.${name} is deprecated. use deferred.{cached,remote}.${name} instead`, false, { id: 'deferred', for: 'ember-cli-zuglet' ,since:'2.4.37', until: '2.6' });
  }

  get cached() {
    return this._cached.promise;
  }

  get remote() {
    return this._remote.promise;
  }

  get promise() {
    this._deprecate('promise');
    return this.cached;
  }

  resolve(type, arg) {
    console.log('resolve', type, arg+'');
    this._settle('resolve', type, arg);
  }

  reject(type, arg) {
    this._settle('reject', type, arg);
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

export const cachedRemoteDefer = () => new CachedRemoteDefer();

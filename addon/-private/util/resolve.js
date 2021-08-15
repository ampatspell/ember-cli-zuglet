import { isPromise } from './types';

const promiseForType = (model, type) => {
  if(!model) {
    return;
  }
  let { promise } = model;
  if(type) {
    let nested = promise[type];
    if(nested) {
      return nested;
    }
  }
  return promise;
}

const toPromises = (args, type) => {
  let models = [];

  args.forEach(arg => {
    if(Array.isArray(arg)) {
      models.push(...arg);
    } else {
      models.push(arg);
    }
  });

  let promises = [];

  models.forEach(model => {
    if(!model) {
      return;
    }
    let promise = promiseForType(model, type);
    if(isPromise(promise)) {
      promises.push(promise);
    } else if(isPromise(model)) {
      promises.push(model);
    }
  });

  return promises;
};

const _resolve = type => (...args) => Promise.all(toPromises(args, type));

const resolve = _resolve();
resolve.cached = _resolve('cached');
resolve.remote = _resolve('remote');

export {
  resolve
}

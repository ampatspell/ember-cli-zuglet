import { isPromise } from './types';

const toPromises = args => {
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

    if(isPromise(model.promise)) {
      promises.push(model.promise);
    } else if(isPromise(model)) {
      promises.push(model);
    }

  });

  return promises;
};

export const resolve = (...args) => {
  let promises = toPromises(args);
  return Promise.all(promises);
};

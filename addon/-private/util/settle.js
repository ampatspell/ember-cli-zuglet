import { defer, allSettled } from 'rsvp';
import { schedule } from '@ember/runloop';

const afterRender = fn => schedule('afterRender', fn);

const settleIteration = fn => {
  let array = fn();
  if(!array || array.length === 0) {
    return;
  }
  return allSettled(array);
}

const settle = (fn, deferred) => {
  afterRender(() => {
    let iteration = settleIteration(fn);
    if(!iteration) {
      deferred.resolve();
      return;
    }
    iteration.then(() => settle(fn, deferred));
  });
}

export default fn => {
  let deferred = defer();
  afterRender(() => settle(fn, deferred));
  return deferred.promise;
}

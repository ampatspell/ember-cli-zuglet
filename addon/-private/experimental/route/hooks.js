import { A } from '@ember/array';

const key = '__zuglet_hooks__';

const _get = (object, functionName) => object[functionName][key];

const extend = (object, functionName, cb) => {
  let arr = _get(object, functionName);
  if(!arr) {
    arr = A();
    let fn = object[functionName];
    object[functionName] = function() {
      fn.call(this, ...arguments);
      _get(this, functionName).map(fn => fn.call(this, ...arguments));
    }
    object[functionName][key] = arr;
  }
  arr.addObject(cb);
}

export const onResetController = (route, cb) => extend(route, 'resetController', cb);

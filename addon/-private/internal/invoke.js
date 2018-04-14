export const invoke = (name, fn) => function(...args) {
  let internal = this._internal;
  let result = internal[name].call(internal, ...args);
  if(fn) {
    result = fn(result, this);
  }
  return result;
};

export const invokeReturningModel = name => invoke(name, internal => internal && internal.model(true));

export const invokePromiseReturningThis = name => invoke(name, (promise, owner) => promise.then(() => owner));

export const invokePromiseReturningUndefined = name => invoke(name, promise => promise.then(() => undefined));

export const invokePromiseReturningModel = name => invoke(name, promise => {
  return promise.then(internal => internal && internal.model(true));
});

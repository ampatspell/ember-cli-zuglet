export const invokeReturningModel = name => function(...args) {
  let internal = this._internal;
  let result = internal[name].call(internal, ...args);
  return result && result.model(true);
};

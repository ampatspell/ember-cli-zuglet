import { isFunction } from './object-to-json';

const {
  assign
} = Object;

export class ZugletError extends Error {

  get serialized() {
    return Object.getOwnPropertyNames(this).reduce((hash, key) => {
      hash[key] = this[key];
      return hash;
    }, {});
  }

  toJSON() {
    let { serialized } = this;
    return { type: 'zuglet-error', serialized };
  }

}

export const error = opts => {
  let { message, code } = opts;
  delete opts.message;
  delete opts.code;

  let err = new ZugletError(message);
  err.code = `zuglet/${code}`;
  assign(err, opts);

  return err;
}

export const documentForRefNotFoundError = ref => error({
  message: `Document '${ref.path}' missing`,
  code: 'document/missing',
  path: ref.path
});

export const documentNotFoundError = () => error({
  message: `Document missing`,
  code: 'document/missing'
});

export const assert = (message, condition) => {
  if(!condition) {
    if(isFunction(message)) {
      message = message();
    }
    throw error({
      message,
      code: 'assert'
    });
  }
}

export const isZugletError = err => {
  return err instanceof ZugletError;
}

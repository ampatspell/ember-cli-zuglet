import { objectToJSON } from './object-to-json';

export class ZugletError extends Error {

  get serialized() {
    return objectToJSON(this);
  }

  toJSON() {
    let { serialized } = this;
    return { type: 'ZugletError', serialized };
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
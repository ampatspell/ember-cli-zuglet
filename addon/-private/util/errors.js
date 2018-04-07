import EmberError from '@ember/error';

export const error = (message, code, opts) => {
  let err = new EmberError(message);
  err.code = code;
  err.opts = opts;
  return err;
};

const zuglet = (message, code, opts) => error(message, `zuglet/${code}`, opts);

export const documentMissingError    = opts => zuglet('Document does not exist', 'document-missing', opts);
export const operationDestroyedError = opts => zuglet('Operation is destroyed', 'operation/destroyed', opts);

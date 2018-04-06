import EmberError from '@ember/error';

export const documentMissingError = opts => {
  let err = new EmberError('Document does not exist');
  err.code = 'zuglet/document-missing';
  err.opts = opts;
  return err;
}

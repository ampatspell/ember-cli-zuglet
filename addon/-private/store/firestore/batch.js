import ZugletObject from '../../../object';
import { isDocument } from './document';
import { isDocumentReference } from './references/document';
import { registerPromise } from '../../stores/stats';
import { assert } from '@ember/debug';

export default class Batch extends ZugletObject {

  store = null;
  _batch = null;
  _callbacks = [];

  constructor(owner, { store, _batch }) {
    super(owner);
    this.store = store;
    this._batch = _batch;
  }

  async commit() {
    try {
      await registerPromise(this, 'commit', this._batch.commit());
      this._callbacks.forEach(hash => hash.resolve());
    } catch(err) {
      this._callbacks.forEach(hash => hash.reject(err));
      throw err;
    }
    return this.store;
  }

  _registerCallbacks(hash) {
    this._callbacks.push(hash);
  }

  save(arg, opts) {
    assert(`argument must be Document not '${arg}'`, isDocument(arg));
    this._registerCallbacks(arg._batchSave(this._batch, opts));
    return arg;
  }

  delete(arg) {
    assert(`argument must be Document or Document Reference not '${arg}'`, isDocument(arg) || isDocumentReference(arg));
    this._registerCallbacks(arg._batchDelete(this._batch));
    return arg;
  }

}

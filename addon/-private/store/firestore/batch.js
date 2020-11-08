import EmberObject from '@ember/object';
import { isDocument } from './document';
import { isDocumentReference } from './references/document';
import { assert } from '@ember/debug';

export default class Batch extends EmberObject {

  store = null
  _batch = null
  _callbacks = [];

  async commit() {
    try {
      await this._batch.commit();
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
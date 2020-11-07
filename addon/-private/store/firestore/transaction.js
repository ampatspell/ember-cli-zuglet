import EmberObject from '@ember/object';
import { isDocument } from './document';
import { isDocumentReference } from './references/document';
import { assert } from '@ember/debug';

export default class Transaction extends EmberObject {

  store = null
  _tx = null

  load(arg, opts) {
    assert(`argument must be Document or DocumentReference not '${arg}'`, isDocument(arg) || isDocumentReference(arg));
    return arg._loadInternal(ref => this._tx.get(ref), opts);
  }

  save(arg, opts) {
    assert(`argument must be Document not '${arg}'`, isDocument(arg));
    return arg._saveInternal((...args) => this._tx.set(...args), opts);
  }

  delete(arg) {
    assert(`argument must be Document not '${arg}'`, isDocument(arg));
    return arg._deleteInternal(ref => this._tx.delete(ref));
  }

}
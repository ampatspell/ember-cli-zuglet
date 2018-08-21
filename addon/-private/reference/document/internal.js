import ReferenceInternal from '../internal';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { reject } from 'rsvp';
import { documentMissingError } from '../../util/errors';

export const isDocumentInternalReference = arg => {
  return ReferenceInternal.detectInstance(arg);
};

export const assertDocumentInternalReference = (name, arg) => {
  assert(`${name} must be document internal reference not ${arg}`, isDocumentInternalReference(arg));
}

export default ReferenceInternal.extend({

  id: readOnly('ref.id'),
  path: readOnly('ref.path'),

  type: 'document',

  createParentInternal(parent) {
    return this.store.createInternalCollectionReferenceForReference(parent);
  },

  createModel() {
    return this.store.factoryFor('zuglet:reference/document').create({ _internal: this });
  },

  collection(path) {
    let ref = this.ref.collection(path);
    return this.store.createInternalCollectionReferenceForReference(ref, this);
  },

  doc(path) {
    assert(`path must be string`, typeOf(path) === 'string');
    assert(`path is required`, !!path);
    let [ first, ...remaining ] = path.split('/');
    assert(`nested document path cannot contain empty path components`, remaining.find(string => string === '') !== '');
    return this.collection(first).doc(remaining.join('/'));
  },

  didLoad(snapshot, opts) {
    if(!snapshot.exists && !opts.optional) {
      return reject(documentMissingError(opts));
    }
    return this.store.createInternalDocumentForSnapshot(snapshot);
  },

  load(opts={}) {
    let { source } = opts;
    return this.get('store.queue').schedule({
      name: 'reference/document/load',
      invoke: () => this.ref.get({ source }),
      didResolve: snapshot => this.didLoad(snapshot, opts),
      didReject: err => reject(err)
    });
  },

  delete() {
    return this.get('store.queue').schedule({
      name: 'reference/document/delete',
      invoke: () => this.ref.delete(),
      didResolve: () => this,
      didReject: err => reject(err)
    });
  },

  loadInTransaction(transaction, opts) {
    return this.get('store.queue').schedule({
      name: 'reference/document/load/transaction',
      invoke: () => {
        let ref = this.ref;
        return transaction.instance.get(ref);
      },
      didResolve: snapshot => this.didLoad(snapshot, opts),
      didReject: err => reject(err)
    });
  },

  deleteInContext(instance) {
    instance.delete(this.ref);
  },

  deleteInTransaction(transaction) {
    this.deleteInContext(transaction.instance);
  },

  deleteInBatch(batch) {
    this.deleteInContext(batch.instance);
  },

  new(props) {
    return this.store.createNewInternalDocumentWithRef(this, props);
  },

  existing() {
    return this.store.createExistingInternalDocumentWithRef(this);
  },

  observe() {
    return this.existing().observe();
  }

});

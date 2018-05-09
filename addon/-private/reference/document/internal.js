import ReferenceInternal from '../internal';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
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

  didLoad(snapshot, opts) {
    if(!snapshot.exists && !opts.optional) {
      return reject(documentMissingError(opts));
    }
    return this.store.createInternalDocumentForSnapshot(snapshot);
  },

  load(opts={}) {
    return this.get('store.queue').schedule({
      name: 'reference/document/load',
      invoke: () => {
        return this.ref.get();
      },
      didResolve: snapshot => this.didLoad(snapshot, opts),
      didReject: err => reject(err)
    });
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

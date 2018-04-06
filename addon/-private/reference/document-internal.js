import ReferenceInternal from './reference-internal';
import { resolve, reject } from 'rsvp';
import { documentMissingError } from '../util/errors';
import { assert } from '@ember/debug';

export const isDocumentInternalReference = arg => {
  return ReferenceInternal.detectInstance(arg);
};

export const assertDocumentInternalReference = (name, arg) => {
  assert(`${name} must be document internal reference not ${arg}`, isDocumentInternalReference(arg));
}

export default ReferenceInternal.extend({

  createParentInternal(parent) {
    return this.store.createInternalCollectionReferenceForReference(parent);
  },

  createModel() {
    return this.store.factoryFor('zuglet:reference/document').create({ _internal: this });
  },

  collection(path) {
    let ref = this.ref.collection(path);
    return this.store.createInternalCollectionReferenceForReference(ref);
  },

  load(opts={}) {
    let ref = this.ref;
    return resolve(ref.get()).then(snapshot => {
      if(!snapshot.exists && !opts.optional) {
        return reject(documentMissingError(opts));
      }
      return this.store.createInternalDocumentForSnapshot(snapshot);
    });
  },

  new(props) {
    return this.store.createNewInternalDocumentWithRef(this, props);
  }

});

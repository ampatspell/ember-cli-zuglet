import Serializer from '../internal/serializer';
import { assert } from '@ember/debug';

import {
  isFirestoreDocumentOrCollectionReference,
  isFirestoreDocumentReference,
  isFirestoreCollectionReference
} from '../../util/firestore-types';

import {
  toInternalDocumentOrCollectionReference,
  isDocumentOrCollectionReference
} from '../../reference/types';

const isAnyReference = value => {
  if(isFirestoreDocumentOrCollectionReference(value)) {
    return true;
  }
  if(isDocumentOrCollectionReference(value)) {
    return true;
  }
  return false;
};

export default Serializer.extend({

  supports(value) {
    return isAnyReference(value);
  },

  matches(internal, value) {
    return isAnyReference(value);
  },

  toInternalReference(value) {
    if(isFirestoreDocumentReference(value)) {
      return this.store.createInternalDocumentReferenceForReference(value);
    } else if(isFirestoreCollectionReference(value)) {
      return this.store.createInternalCollectionReferenceForReference(value);
    }
    return toInternalDocumentOrCollectionReference(value);
  },

  toFirestoreReference(value) {
    if(isFirestoreDocumentOrCollectionReference(value)) {
      return value;
    }
    let internal = toInternalDocumentOrCollectionReference(value);
    return internal.ref;
  },

  createInternal(value) {
    let content = this.toInternalReference(value);
    return this.factoryFor('zuglet:data/reference/internal').create({ serializer: this, content });
  },

  serialize(internal, type) {
    let content = internal.content;
    if(type === 'raw') {
      return content.get('ref');
    } else if(type === 'preview') {
      return `reference:${content.get('path')}`;
    } else if(type === 'model') {
      return content.model(true);
    } else {
      assert(`unsupported type '${type}'`, false);
    }
  },

  deserialize(internal, value) {
    let ref = this.toFirestoreReference(value);
    let replace = true;

    if(internal.content.ref.isEqual(ref)) {
      replace = false;
    } else {
      internal = this.createInternal(ref);
    }

    return {
      replace,
      internal
    };
  }

});

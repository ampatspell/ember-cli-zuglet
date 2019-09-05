import Serializer from '../internal/serializer';
import { blobFromUint8Array, isFirestoreBlob } from '../../util/firestore-types';

const isEqual = (a, b) => {
  if(a.byteLength !== b.byteLength) {
    return false;
  }
  return a.every((val, i) => val === b[i]);
}

const isUint8Array = value => value instanceof Uint8Array;
const toUint8Array = value => isFirestoreBlob(value) ? value.toUint8Array() : value;

export default Serializer.extend({

  supports(value) {
    return isUint8Array(value) || isFirestoreBlob(value);
  },

  matches(internal, value) {
    return isFirestoreBlob(value);
  },

  createInternal(content) {
    content = toUint8Array(content);
    return this.factoryFor('zuglet:data/blob/internal').create({ serializer: this, content });
  },

  serialize(internal, type) {
    let content = internal.content;

    if(type === 'raw') {
      return blobFromUint8Array(content);
    } else {
      return content;
    }
  },

  deserialize(internal, value) {
    value = toUint8Array(value);

    if(isEqual(internal.content, value)) {
      return {
        replace: false,
        internal
      };
    }

    internal.content = value;

    return {
      replace: true,
      internal
    };
  },

  isDirty(internal, raw) {
    raw = toUint8Array(raw);
    return !isEqual(internal.content, raw);
  }

});

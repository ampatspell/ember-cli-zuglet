import Serializer from '../internal/serializer';
import { blobFromUint8Array, isFirestoreBlob } from '../../util/firestore-types';

const isEqual = (a, b) => {
  if(a.byteLength !== b.byteLength) {
    return false;
  }
  return a.every((val, i) => val === b[i]);
}

export default Serializer.extend({

  supports(value) {
    return value instanceof Uint8Array;
  },

  matches(internal, value) {
    return isFirestoreBlob(value);
  },

  createInternal(content) {
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
    value = value.toUint8Array();

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
    window.raw = raw;
    raw = raw.toUint8Array();
    return !isEqual(internal.content, raw);
  }

});

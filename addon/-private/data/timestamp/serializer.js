import Serializer from '../internal/serializer';
import { isFirestoreTimestamp } from '../../util/firestore-types';
import { typeOf } from '@ember/utils';

export default Serializer.extend({

  supports(value) {
    return isFirestoreTimestamp(value) || typeOf(value) === 'date';
  },

  toDate(value) {
    if(isFirestoreTimestamp(value)) {
      return value.toDate();
    }
    return value;
  },

  createInternal(content) {
    content = this.toDate(content);
    return this.factoryFor('zuglet:data/timestamp/internal').create({ serializer: this, content });
  },

  deserialize(value) {
    return this.createInternal(value);
  },

  update(internal, value) {
    internal = this.createInternal(value);
    return {
      replace: true,
      internal
    };
  }

});

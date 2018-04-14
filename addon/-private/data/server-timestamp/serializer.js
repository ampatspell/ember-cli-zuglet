import Serializer from '../internal/serializer';
import { isFirestoreServerTimestamp } from '../../util/firestore-types';

export default Serializer.extend({

  supports(value) {
    return isFirestoreServerTimestamp(value);
  },

  createInternal(content) {
    return this.factoryFor('zuglet:data/server-timestamp/internal').create({ serializer: this, content });
  },

  serialize(internal, type) {
    let content = internal.content;
    if(type === 'preview') {
      return 'server-timestamp';
    } else {
      return content;
    }
  },

  deserialize(value) {
    return this.createInternal(value);
  },

  update(internal) {
    return {
      replace: false,
      internal
    };
  }

});

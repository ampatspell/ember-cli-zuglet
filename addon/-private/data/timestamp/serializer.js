import Serializer from '../internal/serializer';
import { isFirestoreTimestamp, isFirestoreServerTimestamp } from '../../util/firestore-types';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { DateTime } from 'luxon';

const isLuxonDateTime = value => value instanceof DateTime;
const isJSDate = value => typeOf(value) === 'date';

const toDate = value => {
  if(isFirestoreTimestamp(value)) {
    return value.toDate();
  } else if(isLuxonDateTime(value)) {
    return value.toJSDate();
  }
  return value;
};

const isAnyDate = value =>
  isFirestoreTimestamp(value) ||
  isJSDate(value) ||
  isFirestoreServerTimestamp(value) ||
  isLuxonDateTime(value);

export default Serializer.extend({

  supports(value) {
    return isAnyDate(value);
  },

  matches(internal, value) {
    return isAnyDate(value);
  },

  createInternal(content) {
    content = toDate(content);
    return this.factoryFor('zuglet:data/timestamp/internal').create({ serializer: this, content });
  },

  serialize(internal, type) {
    if(type === 'raw') {
      return internal.get('content');
    } else if(type === 'preview') {
      if(internal.get('isServerTimestamp')) {
        return `timestamp:server`;
      }
      return internal.get('date');
    } else if(type === 'model') {
      return internal.get('date');
    } else {
      assert(`unsupported type '${type}'`, false);
    }
  },

  deserialize(internal, value) {
    let contentServerTimestamp = isFirestoreServerTimestamp(internal.content);
    let valueServerTimeStamp = isFirestoreServerTimestamp(value);

    if(contentServerTimestamp && valueServerTimeStamp) {
      return {
        replace: false,
        internal
      };
    }

    let contentDate = internal.get('date');
    if(contentDate) {
      let valueDate = toDate(value);
      if(valueDate) {
        if(contentDate.getTime() === valueDate.getTime()) {
          return {
            replace: false,
            internal
          };
        }
      }
    }

    internal = this.createInternal(value);
    return {
      replace: true,
      internal
    };
  },

  isDirty(internal, value) {
    let contentServerTimestamp = isFirestoreServerTimestamp(internal.content);
    let valueServerTimeStamp = isFirestoreServerTimestamp(value);

    if(contentServerTimestamp && valueServerTimeStamp) {
      return false;
    }

    if(contentServerTimestamp || valueServerTimeStamp) {
      return true;
    }

    let contentDate = toDate(internal.content);
    let valueDate = toDate(value);

    return contentDate.getTime() === valueDate.getTime();
  }

});

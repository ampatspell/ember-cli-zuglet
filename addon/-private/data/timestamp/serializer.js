import Serializer from '../internal/serializer';
// import { isFirestoreTimestamp, isFirestoreServerTimestamp } from '../../util/firestore-types';
// import { typeOf } from '@ember/utils';
// import { assert } from '@ember/debug';
// import { DateTime } from 'luxon';

// const isLuxonDateTime = value => value instanceof DateTime;
// const isJSDate = value => typeOf(value) === 'date';

export default Serializer.extend({

  // supports(value) {
  //   return isFirestoreServerTimestamp(value) ||
  //          isFirestoreTimestamp(value) ||
  //          isLuxonDateTime(value) ||
  //          isJSDate(value);
  // },

  // createInternal(content) {
  //   if(isFirestoreTimestamp(content)) {
  //     content = content.toDate();
  //   } else if(isLuxonDateTime(content)) {
  //     content = content.toJSDate();
  //   }
  //   return this.factoryFor('zuglet:data/timestamp/internal').create({ serializer: this, content });
  // },

  // deserialize(value) {
  //   return this.createInternal(value);
  // },

  // serialize(internal, type) {
  //   if(type === 'raw') {
  //     return internal.get('content');
  //   } else if(type === 'preview') {
  //     if(internal.get('isServerTimestamp')) {
  //       return `timestamp:server`;
  //     }
  //     return internal.get('date');
  //   } else if(type === 'model') {
  //     return internal.get('date');
  //   } else {
  //     assert(`unsupported type '${type}'`, false);
  //   }
  // },

  // update(internal, value) {
  //   internal = this.createInternal(value);
  //   return {
  //     replace: true,
  //     internal
  //   };
  // }

});

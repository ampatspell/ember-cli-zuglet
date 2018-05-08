import Internal from '../internal/internal';
import { computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import { isFirestoreServerTimestamp } from '../../util/firestore-types';
import { DateTime } from 'luxon';

export default Internal.extend({

  content: null,

  isTimestamp: true,

  isServerTimestamp: computed('content', function() {
    return isFirestoreServerTimestamp(this.get('content'));
  }).readOnly(),

  date: computed('content', function() {
    let content = this.get('content');
    if(typeOf(content) === 'date') {
      return content;
    }
    return null;
  }).readOnly(),

  dateTime: computed('date', function() {
    let date = this.get('date');
    if(!date) {
      return date;
    }
    return DateTime.fromJSDate(date);
  }).readOnly(),

  createModel() {
    return this.factoryFor('zuglet:data/timestamp').create({ _internal: this });
  },

  fetch() {
  }

});
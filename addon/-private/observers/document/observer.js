import Observer from '../observer/observer';
import { computed } from '@ember/object';
import { deprecatingAlias } from '@ember/object/computed';

export default Observer.extend({

  content: computed(function() {
    return this.get('_internal.doc').model(true);
  }).readOnly(),

  doc: deprecatingAlias('content', {
    id: 'ember-cli-zuglet-observer-doc',
    until: '0.9.0'
  }),

  toStringExtension() {
    return this.get('content.path');
  }

});

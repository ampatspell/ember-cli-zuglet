import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  data: computed(function() {
    return this.get('store').object({ ok: true, user: { name: 'Duck' } });
  }).readOnly()

});

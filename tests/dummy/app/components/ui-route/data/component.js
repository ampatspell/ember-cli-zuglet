import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  data: computed(function() {
    let data = this.get('store').object({ ok: true, user: { name: 'Duck' } });
    window.data = data;
    console.log(`window.data = ${data}`);
    return data;
  }).readOnly()

});

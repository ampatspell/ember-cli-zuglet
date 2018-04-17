import Component from '@ember/component';
import layout from './template';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-browser' ],
  attributeBindings: [ 'style' ],
  layout,

  width: 0,
  height: 0,

  style: computed('width', 'height', function() {
    let { width, height } = this.getProperties('width', 'height');
    let style = [];
    if(width) {
      style.push(`width: ${width}px;`);
    }
    if(height) {
      style.push(`height: ${height}px;`);
    }
    if(style.length === 0) {
      return;
    }
    return htmlSafe(style.join(' '));
  }).readOnly(),

});

import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  tagName: '',
  layout,

  items: null,

}).reopenClass({
  positionalParams: [ 'items' ]
});

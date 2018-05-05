import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':item' ],
  layout
});

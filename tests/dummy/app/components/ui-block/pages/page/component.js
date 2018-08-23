import Component from '@ember/component';
import layout from './template';
import { observer } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  classNameBindings: [ ':ui-block-pages-page' ],
  layout,

  didInsertElement() {
    this._super(...arguments);
    this.scrollToContent();
  },

  scrollToContent: observer('page', function() {
    let { top } = $(this.element).offset();
    window.scrollTo(0, top - 30);
  })

});

import Component from '@ember/component';
import layout from './template';
import { observer } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-pages-page' ],
  layout,

  scrollToContent: false,

  didInsertElement() {
    this._super(...arguments);
    this._scrollToContent();
  },

  _scrollToContent: observer('page', function() {
    if(!this.get('scrollToContent')) {
      return;
    }
    let top = this.element.offsetTop;
    window.scrollTo(0, top - 30);
  })

});

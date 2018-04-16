import Component from '@ember/component';
import layout from './template';
import { join } from '@ember/runloop';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':master' ],
  layout,

  top: 0,

  didInsertElement() {
    this._super(...arguments);
    this._scroll = () => join(() => this.onScroll());
    window.addEventListener('scroll', this._scroll);
    this.onScroll();
  },

  willDestroyElement() {
    this._super(...arguments);
    window.removeEventListener('scroll', this._scroll);
  },

  onScroll() {
    this.set('top', window.scrollY);
  },

  stickyStyle: computed('top', function() {
    let top = this.get('top');
    return htmlSafe(`top: ${top}px`);
  }).readOnly()

});

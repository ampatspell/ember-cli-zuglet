import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNameBindings: [ ':ui-block-console' ],
  layout,

  lines: computed(function() {
    return A();
  }),

  actions: {
    enter() {
      let value = this.get('input');
      this.set('input', '');
      try {
        let result = value; // eval(value);
        this.get('lines').pushObject(`${result}`);
      } catch(err) {
        console.log(err.stack);
      }
    }
  },

  focusInput() {
    let input = this.get('element').querySelector('.line.input > input');
    input.focus();
  },

  click() {
    this.focusInput();
  },

  didInsertElement() {
    this._super(...arguments);
    this.focusInput();
  }

});

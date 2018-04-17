import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { typeOf } from '@ember/utils';

export default Component.extend({
  classNameBindings: [ ':ui-block-console' ],
  layout,

  lines: computed(function() {
    return A();
  }),

  context: computed(function() {
    return {
      store: this.get('store')
    };
  }),

  actions: {
    enter() {
      let value = this.get('input');
      this.set('input', '');
      try {
        let result = this.stringify(this.invoke(value));
        this.get('lines').pushObject(`${result}`);
      } catch(err) {
        console.log(err.stack);
      }
    }
  },

  stringify(result) {
    if(typeOf(result) === 'object') {
      let hash = {};
      for(let key in result) {
        let value = result[key];
        if(typeOf(value) === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        hash[key] = value;
      }
      return JSON.stringify(hash);
    }
    return String(result);
  },

  invoke(string) {
    let context = this.get('context');
    return (function() {
      return eval(string);
    }).call(context);
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

import Component from '@ember/component';
import layout from './template';
import { observed } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({
  layout,

  doc: observed(),

  didInsertElement() {
    this._super(...arguments);
    this.set('doc', this.get('store').doc('messages/first').existing());
  },

  actions: {
    save(doc) {
      doc.save();
    },
    reset(doc) {
      doc.reset();
    }
  }

});

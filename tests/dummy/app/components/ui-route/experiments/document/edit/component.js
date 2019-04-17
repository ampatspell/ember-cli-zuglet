import Component from '@ember/component';
import layout from './template';
import { observed } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({
  layout,

  version: 0,
  doc: observed(),

  didInsertElement() {
    this._super(...arguments);
    let doc = this.get('store').doc('messages/first').existing();
    this.set('doc', doc);
  },

  actions: {
    save(doc) {
      this.incrementProperty('version');
      doc.save({ token: this.version });
    },
    reset(doc) {
      doc.reset();
    }
  }

});

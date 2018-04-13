import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  doc: null,

  didInsertElement() {
    this._super(...arguments);
    this.get('store').doc('messages/first').load({ optional: true }).then(doc => {
      if(this.isDestroying) {
        return;
      }
      let cancel = doc.observe();
      this.setProperties({
        doc,
        cancel
      });
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    let cancel = this.get('cancel');
    cancel && cancel();
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

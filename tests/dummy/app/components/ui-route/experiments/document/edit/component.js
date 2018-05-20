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
      let observer = doc.observe();
      this.setProperties({
        doc,
        observer
      });
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    let observer = this.get('observer');
    observer && observer.cancel();
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

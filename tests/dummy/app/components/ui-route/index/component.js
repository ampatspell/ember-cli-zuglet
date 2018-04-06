import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  query: window.query,

  actions: {
    start() {
      this.set('cancel', this.get('query').observe());
    },
    stop() {
      let cancel = this.get('cancel');
      cancel();
      this.set('cancel', null);
    }
  }

});

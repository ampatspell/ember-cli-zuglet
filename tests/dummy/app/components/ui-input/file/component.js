import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-input-file' ],
  layout,

  actions: {
    onChange(e) {
      let files = e.target.files;
      let file = files[0];
      if(!file) {
        return;
      }
      this.set('selection', file);
      let update = this.get('update');
      update && update(file);
    }
  }

});

import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-route-experiments-wip' ],
  layout,

  type: 'duck',
  name: '',

  actions: {
    add() {
      let { type, name } = this.getProperties('type', 'name');
      this.model.add(type, name);
      this.setProperties({ name: '' });
    },
    remove(model) {
      model.remove();
    },
    save() {
      this.model.save();
    }
  }

});

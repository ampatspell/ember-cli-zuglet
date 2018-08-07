import EmberObject, { defineProperty, computed } from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({

  owner: null,
  key: null,

  content: null,

  init() {
    this._super(...arguments);
    this.prepare();
  },

  prepare() {
    let key = this.get('key');
    let path = `owner.${key}`;
    defineProperty(this, 'content', computed(path, function() {
      return A(this.get(path));
    }).readOnly());
  }

});

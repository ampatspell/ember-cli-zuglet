import EmberObject from '@ember/object';
import PromiseMixin from './-promise';

export default EmberObject.extend(PromiseMixin, {

  id: null,

  _deserialize(json) {
    this.set('node', json);
  },

  _load() {
    let id = this.get('id');
    return this._loadJSON(`/${id}.json`).then(json => this._deserialize(json)).then(() => this);
  },

  preprocessNode(parent, node) {
  }

});

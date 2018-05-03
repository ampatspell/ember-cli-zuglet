import EmberObject from '@ember/object';
import PromiseMixin from './-promise';

export default EmberObject.extend(PromiseMixin, {

  _deserialize(json) {
    console.log(json);
  },

  _load() {
    return this._loadJSON('/_index.json').then(json => this._deserialize(json)).then(() => this);
  }

});

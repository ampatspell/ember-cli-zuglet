import Mixin from '@ember/object/mixin';
import fetch from 'fetch';

export default Mixin.create({

  rootURL: 'http://localhost:4200/assets/ember-cli-remark-static/docs',

  _loadJSON(url) {
    let root = this.get('rootURL');
    return fetch(`${root}${url}`).then(res => res.json());
  },

  load() {
    let promise = this._promise;
    if(!promise) {
      promise = this._load();
      this._promise = promise;
    }
    return promise;
  }

});
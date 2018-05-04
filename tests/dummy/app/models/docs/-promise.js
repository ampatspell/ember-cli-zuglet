import Mixin from '@ember/object/mixin';
import fetch from 'fetch';

export default Mixin.create({

  url: '/assets/ember-cli-remark-static/docs',

  _loadJSON(url) {
    let root = this.get('url');
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
import Mixin from '@ember/object/mixin';
import fetch from 'fetch';
import resolve from '../../utils/resolve-url';

export default Mixin.create({

  _loadJSON(url) {
    return fetch(resolve(this, '/assets/ember-cli-remark-static/docs', url)).then(res => res.json());
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

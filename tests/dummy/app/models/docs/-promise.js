import Mixin from '@ember/object/mixin';
import fetch from 'fetch';
import environment from '../../config/environment';
import { computed } from '@ember/object';
import { isFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

export default Mixin.create({

  url: computed(function() {
    let path = '/assets/ember-cli-remark-static/docs';
    if(isFastBoot(this)) {
      return `${environment.docs.url}${path}`;
    }
    return path;
  }).readOnly(),

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

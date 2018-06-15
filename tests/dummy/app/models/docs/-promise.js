import Mixin from '@ember/object/mixin';
import fetch from 'fetch';
import { computed } from '@ember/object';
import { getFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

const path = '/assets/ember-cli-remark-static/docs';

export default Mixin.create({

  url: computed(function() {
    let { fastboot, isFastBoot } = getFastBoot(this);
    if(isFastBoot) {
      let { protocol, host } = fastboot.get('request').getProperties('protocol', 'host');
      return `${protocol}//${host}${path}`;
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

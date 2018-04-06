import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-links' ],

  baseURL: 'https://github.com/ampatspell/ember-cli-zug/tree/master/tests/dummy/app',

  url: null,

  fullBaseURL: computed('baseURL', 'url', function() {
    let { baseURL, url } = this.getProperties('baseURL', 'url');
    if(url) {
      return `${baseURL}/${url}`;
    }
    return baseURL;
  }),

});

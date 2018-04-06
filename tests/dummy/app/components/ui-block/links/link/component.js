import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'a',
  classNameBindings: [ ':link' ],
  attributeBindings: [ 'href', 'target' ],

  baseURL: null,
  title: null,
  url: null,

  target: 'top',

  href: computed('baseURL', 'url', function() {
    let { baseURL, url } = this.getProperties('baseURL', 'url');
    if(!baseURL) {
      return url;
    }
    return `${baseURL}/${url}`;
  }).readOnly()

});

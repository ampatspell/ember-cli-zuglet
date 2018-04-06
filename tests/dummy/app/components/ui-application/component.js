import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-application' ],

  zug: computed(function() {
    return getOwner(this).factoryFor('config:environment').class.zug;
  }),

});

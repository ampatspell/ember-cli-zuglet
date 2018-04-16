import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-route-docs-api-store-references-index', ':markdown' ],
  layout
});

import Component from '@ember/component';
import layout from './template';
import environment from 'dummy/config/environment';

const {
  version
} = environment;

export default Component.extend({
  classNameBindings: [ ':ui-block-content-header' ],
  layout,
  version
});

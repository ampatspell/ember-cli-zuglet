import Component from '@ember/component';
import layout from './template';
import { model } from 'ember-cli-zuglet/experimental/object';

export default Component.extend({
  layout,

  model: model('path', 'experiments/document-by-path', function() {
    let path = this.get('path');
    return {
      path
    };
  })

});

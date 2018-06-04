import Component from '@ember/component';
import layout from './template';
import model from 'ember-cli-zuglet/experimental/model';

export default Component.extend({
  layout,

  model: model('path', 'experiments/document-by-path').mapping(owner => {
    let path = owner.get('path');
    return {
      path
    };
  })

});

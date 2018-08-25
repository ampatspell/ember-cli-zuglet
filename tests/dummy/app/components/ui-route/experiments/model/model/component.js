import Component from '@ember/component';
import layout from './template';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({
  layout,

  model: model().owner('path').named('experiments/document-by-path').mapping(owner => {
    let path = owner.get('path');
    return {
      path
    };
  })

});

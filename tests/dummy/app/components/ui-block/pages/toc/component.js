import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-pages-toc' ],
  layout,

  tree: readOnly('docs.index.tree'),

});

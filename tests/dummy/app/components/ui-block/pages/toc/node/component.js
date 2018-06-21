import Component from '@ember/component';
import layout from './template';
import { sort } from '@ember/object/computed';

const sortedDesc = [ 'pos:asc' ];

export default Component.extend({
  tagName: '',
  layout,

  sortedDesc,
  sorted: sort('page.pages', 'sortedDesc')

});

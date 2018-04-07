import Internal from '../internal';
import QueryableInternalMixin from './queryable-internal-mixin';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Internal.extend(QueryableInternalMixin, {

  store: null,
  ref: null,
  _parent: null,
  info: null,

  parent: readOnly('_parent'),
  type: readOnly('info.name'),
  args: readOnly('info.args'),

  string: computed(function() {
    let parent = this.get('parent.string');
    let info = this.get('info');
    let string = info.formatter.string(info);
    if(parent) {
      return `${parent}.${string}`;
    }
    return string;
  }).readOnly(),

  serialized: computed(function() {
    let arr = this.get('parent.serialized') || [];
    let info = this.get('info');
    arr.push(info.formatter.object(info));
    return arr;
  }),

  createModel() {
    return this.store.factoryFor('zuglet:reference/query').create({ _internal: this });
  }

});

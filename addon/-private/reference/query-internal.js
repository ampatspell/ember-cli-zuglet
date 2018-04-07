import Internal from '../internal';
import QueryableInternalMixin from './queryable-internal-mixin';
import { computed } from '@ember/object';

export default Internal.extend(QueryableInternalMixin, {

  store: null,
  ref: null,
  info: null,

  type: computed(function() {
    return this.get('info.formatter.name');
  }),

  stringValue: computed(function() {
    let info = this.get('info');
    return info.formatter.string(info);
  }).readOnly(),

  objectValue: computed(function() {
    let info = this.get('info');
    return info.formatter.object(info);
  }).readOnly(),

  createModel() {
    return this.store.factoryFor('zuglet:reference/query').create({ _internal: this });
  }

});

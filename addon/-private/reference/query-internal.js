import { computed } from '@ember/object';
import Internal from '../internal';
import QueryableInternalMixin from './queryable-internal-mixin';

export default Internal.extend(QueryableInternalMixin, {

  store: null,
  ref: null,

  createModel() {
    return this.store.factoryFor('zuglet:reference/query').create({ _internal: this });
  }

});
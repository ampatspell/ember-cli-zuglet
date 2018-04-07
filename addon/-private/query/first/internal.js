import QueryInternal from '../internal';
import { computed } from '@ember/object';

export default QueryInternal.extend({

  type: 'first',

  content: null,

  proxy: computed('content', function() {
    let content = this.get('content');
    if(!content) {
      return null;
    }
    return content.model(true);
  }).readOnly(),

  createModel() {
    return this.store.factoryFor('zuglet:query/first').create({ _internal: this });
  },

  normalizedQuery: computed('query', function() {
    let query = this.get('query');
    if(!query) {
      return;
    }
    return query.limit(1);
  }),

  onReplace(snapshot) {
    let change = snapshot.docs[0];
    let current = this.get('content');
    if(change) {
      if(current && current.get('ref.path') === change.ref.path) {
        this.updateInternalDocumentForSnapshot(current, change);
      } else {
        let doc = this.createInternalDocumentForSnapshot(change);
        this.set('content', doc);
      }
    } else {
      this.set('content', null);
    }
  },

  didLoad(snapshot) {
    this.onReplace(snapshot);
    return this._super(...arguments);
  },

  onSnapshot(snapshot) {
    this.onReplace(snapshot);
    return this._super(...arguments);
  }

});

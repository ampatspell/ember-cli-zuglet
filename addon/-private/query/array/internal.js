import QueryInternal from '../internal';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';

export default QueryInternal.extend({

  type: 'array',

  content: computed(function() {
    return A();
  }).readOnly(),

  proxy: computed(function() {
    let content = this.get('content');
    return this.store.factoryFor('zuglet:query/array/content').create({ content });
  }).readOnly(),

  createModel() {
    return this.store.factoryFor('zuglet:query/array').create({ _internal: this });
  },

  //

  onChange(change) {
    let { type, oldIndex, newIndex, doc: snapshot } = change;

    let path = snapshot.ref.path;

    let content = this.get('content');

    if(type === 'added') {
      assert(`added: doc exists ${path}`, !content.findBy('ref.path', path));
      let doc = this.createInternalDocumentForSnapshot(snapshot);
      content.insertAt(newIndex, doc);
    } else if(type === 'modified') {
      let doc = content.objectAt(oldIndex);
      if(!doc || doc.get('ref.path') !== path) {
        doc = content.findBy('ref.path', path);
      }
      assert(`modified: doc not found ${path}`, doc);
      this.updateInternalDocumentForSnapshot(doc, snapshot);
      if(oldIndex !== newIndex) {
        content.removeAt(oldIndex);
        content.insertAt(newIndex, doc);
      }
    } else if(type === 'removed') {
      content.removeAt(oldIndex);
    }
  },

  onChanges(snapshot) {
    snapshot.docChanges({ includeMetadataChanges: true }).map(change => this.onChange(change));
  },

  onReplace(snapshot) {
    let content = this.get('content');
    let documents = A(snapshot.docs.map(doc => {
      let document = content.findBy('ref.path', doc.ref.path);
      if(document) {
        return this.updateInternalDocumentForSnapshot(document, doc);
      }
      return this.createInternalDocumentForSnapshot(doc);
    }));
    content.replace(0, content.get('length'), documents);
  },

  needsReplace: true,

  onSnapshot(snapshot) {
    if(this.needsReplace) {
      this.onReplace(snapshot);
      this.needsReplace = false;
    } else {
      this.onChanges(snapshot);
    }
    return this._super(...arguments);
  },

  didLoad(snapshot) {
    this.onReplace(snapshot);
    this.needsReplace = true;
    return this._super(...arguments);
  },

  subscribeQueryOnSnapshot() {
    this.needsReplace = true;
    return this._super(...arguments);
  }

});

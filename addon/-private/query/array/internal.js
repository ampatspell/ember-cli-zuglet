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

  proxyContentWillChange() {
    // When objects are removed from content and before that proxy hasn't been touched,
    // in proxy array observer (`array.addArrayObserver`) callbacks undefined objects are returned
    //
    // This is due to the fact array proxy is using `arrangedContent` in weird way.
    // That needs a better solution.
    //
    this.get('proxy').slice();
  },

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
    this.proxyContentWillChange();

    snapshot.docChanges({ includeMetadataChanges: true }).map(change => this.onChange(change));
  },

  onReplace(snapshot) {
    this.proxyContentWillChange();

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

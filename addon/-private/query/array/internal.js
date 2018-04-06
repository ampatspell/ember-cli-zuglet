import QueryInternal from '../internal';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default QueryInternal.extend({

  createModel() {
    return this.store.factoryFor('zuglet:query/array').create({ _internal: this });
  },

  content: computed(function() {
    return A();
  }).readOnly(),

  proxy: computed(function() {
    let content = this.get('content');
    return this.store.factoryFor('zuglet:query/array/content').create({ content });
  }).readOnly(),

  didLoad(snapshot) {
    // console.log('didLoad', snapshot, this.isMetadataEqual(snapshot.metadata));

    let content = this.get('content');
    let documents = A(snapshot.docs.map(doc => this.createInternalDocumentForSnapshot(doc)));

    content.replace(0, content.get('length'), documents);

    return this._super(...arguments);
  },

  // _onChange(change) {
  //   let { type, oldIndex, newIndex, doc: snapshot } = change;

  //   let path = snapshot.ref.path;

  //   let content = this.get('content');
  //   let document = content.findBy('path', path);

  //   if(type === 'added') {
  //     if(!document) {
  //       console.log('add new', path);
  //     } else {
  //       console.log('add existing', path);
  //     }
  //   } else if(type === 'modified') {
  //     if(document) {
  //       document._onSnapshot(snapshot);
  //     } else {
  //       console.log('modified non existant', path);
  //     }
  //   } else if(type === 'removed') {
  //     console.log('removed', path);
  //   }
  // },

  onSnapshot(snapshot) {
    // console.log('onSnapshot', snapshot, this.isMetadataEqual(snapshot.metadata));

    // snapshot.docChanges.map(change => this._onChange(change));

    return this._super(...arguments);
  }

});

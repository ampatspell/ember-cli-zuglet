import Query from './query';
import { assert } from '@ember/debug';
import { A } from '@ember/array';

export default class QueryArray extends Query {

  constructor() {
    super(...arguments);
    this.content = A([]);
  }

  _onSnapshotRefresh(current, snapshots) {
    let content = A();
    snapshots.docs.forEach(snapshot => {
      let path = snapshot.ref.path;
      let doc = current.find(doc => doc.path === path);
      if(doc) {
        doc._onSnapshot(snapshot);
        doc._onSnapshotMetadata(snapshot);
      } else {
        doc = this._createDocumentForSnapshot(snapshot);
      }
      content.pushObject(doc);
    });
    this.content = content;
  }

  _onSnapshotChange(content, change) {
    let { type, oldIndex, newIndex, doc: snapshot } = change;
    if(type === 'added') {
      let doc = this._createDocumentForSnapshot(snapshot);
      assert(`invalid snapshot change newIndex ${newIndex} for added`, newIndex !== -1);
      content.insertAt(newIndex, doc);
    } else if(type === 'modified') {
      let existing = content[oldIndex];
      if(!existing) {
        let path = snapshot.ref.path;
        existing = content.find(doc => doc.path === path);
        assert(`existing document not found for path '${path}'`, !!existing);
      }
      existing._onSnapshot(snapshot, { source: 'subscription' });
    } else if(type === 'removed') {
      let existing = content[oldIndex];
      if(existing) {
        existing._onDeleted();
      } else {
        // TODO: figure out if here oldIndex can also be wrong or -1
        console.warn(`existing doc not found for index ${oldIndex} in query array onSnapshotChange with 'removed' type`);
      }
      content.removeAt(oldIndex);
    }
  }

  _onSnapshotChanges(content, snapshot) {
    snapshot.docChanges({ includeMetadataChanges: true }).map(change => {
      this._onSnapshotChange(content, change);
    });
    content.forEach(doc => doc._onSnapshotMetadata(snapshot));
  }

  _onSnapshot(snapshot, refresh) {
    let { content } = this;
    if(refresh) {
      this._onSnapshotRefresh(content, snapshot);
    } else {
      this._onSnapshotChanges(content, snapshot);
    }
    this._notifyOnData();
  }

  _onLoad(_snapshot) {
    let { content } = this;
    this.content = _snapshot.docs.map(snapshot => {
      let path = snapshot.ref.path;
      let doc = content.find(doc => doc.path === path);
      if(!doc) {
        doc = this._createDocumentForSnapshot(snapshot);
      } else {
        doc._onSnapshot(snapshot);
      }
      return doc;
    });
    this._notifyOnData();
  }

}

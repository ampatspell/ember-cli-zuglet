import Query from './query';

export default class QuerySingle extends Query {

  _first(_snapshot) {
    let snapshot = _snapshot.docs[0];
    if(_snapshot.docs.length > 1) {
      console.warn(`${this.ref.string}.query({ type: 'single' }) yields more than 1 document`);
    }
    return snapshot;
  }

  _onSnapshotInternal(_snapshot) {
    let snapshot = this._first(_snapshot);
    let { content } = this;
    if(snapshot) {
      if(content && content.path === snapshot.ref.path) {
        content._onSnapshot(snapshot, { source: 'subscription' });
      } else {
        this.content = this._createDocumentForSnapshot(snapshot);
      }
    } else {
      if(content) {
        content._onDeleted();
      }
      this.content = null;
    }
    this._notifyOnData();
  }

  _onSnapshot(snapshot) {
    this._onSnapshotInternal(snapshot);
  }

  _onLoad(snapshot) {
    this._onSnapshotInternal(snapshot);
  }

}

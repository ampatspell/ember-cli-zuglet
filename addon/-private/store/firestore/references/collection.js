import QueryableReference from './queryable';

export default class CollectionReference extends QueryableReference {

  get id() {
    return this._ref.id;
  }

  get path() {
    return this._ref.path;
  }

  //

  doc(path) {
    let _ref;
    if(path) {
      _ref = this._ref.doc(path);
    } else {
      _ref = this._ref.doc();
    }
    return this.store.doc(_ref);
  }

  //

  get string() {
    return this.path;
  }

  get serialized() {
    let { id, path } = this;
    return { id, path };
  }

  toStringExtension() {
    return `${this.path}`;
  }

}

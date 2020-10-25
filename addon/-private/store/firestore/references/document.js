import Reference from './reference';

export default class DocumentReference extends Reference {

  get id() {
    return this._ref.id;
  }

  get path() {
    return this._ref.path;
  }

  collection(path) {
    return this.store.collection(this._ref.collection(path));
  }

  //

  //

  get serialized() {
    let { id, path } = this;
    return { id, path };
  }

  toStringExtension() {
    return `${this.path}`;
  }

}

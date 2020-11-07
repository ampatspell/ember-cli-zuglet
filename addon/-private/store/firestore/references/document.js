import Reference from './reference';
import { documentForRefNotFoundError } from '../../../util/error';

const {
  assign
} = Object;

export const isDocumentReference = arg => arg instanceof DocumentReference;

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

  new(data) {
    return this.store._createDocumentForReference(this, data || {});
  }

  existing() {
    return this.store._createDocumentForReference(this, null);
  }

  async _loadInternal(get, opts) {
    let { optional } = assign({ optional: false }, opts);
    let { _ref } = this;
    let snapshot = await get(_ref);
    if(!snapshot.exists) {
      if(optional) {
        return;
      }
      throw documentForRefNotFoundError(_ref);
    }
    return this.store._createDocumentForSnapshot(snapshot);
  }

  load(opts) {
    return this._loadInternal(ref => ref.get(), opts);
  }


  //

  get serialized() {
    let { id, path } = this;
    return { id, path };
  }

  toStringExtension() {
    return `${this.path}`;
  }

}

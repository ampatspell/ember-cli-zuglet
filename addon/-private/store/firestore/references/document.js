import Reference from './reference';
import { documentForRefNotFoundError } from '../../../util/error';
import { cached } from '../../../model/decorators/cached';

const {
  assign
} = Object;

export const isDocumentReference = arg => arg instanceof DocumentReference;

const noop = () => {};

export default class DocumentReference extends Reference {

  get id() {
    return this._ref.id;
  }

  get path() {
    return this._ref.path;
  }

  @cached()
  get parent() {
    let ref = this._ref.parent;
    return this.store.collection(ref);
  }

  //

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

  load(opts) {
    return this._loadInternal(ref => ref.get(), opts);
  }

  async delete() {
    await this._ref.delete();
  }

  //

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

  _batchDelete(batch) {
    batch.delete(this._ref);
    return {
      resolve: noop,
      reject: noop
    };
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

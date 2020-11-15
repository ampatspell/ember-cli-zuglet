import QueryableReference from './queryable';
import { cached } from '../../../model/decorators/cached';

export default class CollectionReference extends QueryableReference {

  get id() {
    return this._ref.id;
  }

  get path() {
    return this._ref.path;
  }

  @cached()
  get parent() {
    let ref = this._ref.parent;
    if(!ref) {
      return null;
    }
    return this.store.doc(ref);
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

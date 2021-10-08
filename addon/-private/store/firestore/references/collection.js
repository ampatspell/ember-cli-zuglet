import QueryableReference from './queryable';
import { cached } from '../../../model/decorators/cached';
import { doc } from 'firebase/firestore';

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
      _ref = doc(this._ref, path);
    } else {
      _ref = doc(this._ref);
    }
    return this.store.doc(_ref);
  }

  //

  get dashboardURL() {
    let { store: { dashboardURL }, path } = this;
    return `${dashboardURL}/firestore/data/${path}`;
  }

  openDashboard() {
    window.open(this.dashboardURL, '_blank');
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

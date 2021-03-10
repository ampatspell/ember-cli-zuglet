import ZugletObject from '../../../../object';
import { toJSON } from '../../../util/to-json';

export default class Reference extends ZugletObject {

  store = null
  _ref = null

  constructor(owner, { store, _ref }) {
    super(owner);
    this.store = store;
    this._ref = _ref;
  }

  //

  get _path() {
    let ref = this;
    while(ref) {
      let { path } = ref;
      if(path) {
        return path;
      }
      ref = ref.parent;
    }
    return undefined;
  }

  get dashboardURL() {
    let { store: { dashboardURL }, _path } = this;
    return `${dashboardURL}/firestore/data/${_path}`;
  }

  openDashboard() {
    window.open(this.dashboardURL, '_blank');
  }

  //

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
